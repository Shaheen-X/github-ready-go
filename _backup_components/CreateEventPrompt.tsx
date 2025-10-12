import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  MapPin,
  UserRound,
  Users,
} from 'lucide-react';

import { connectedUsers, eventTemplates } from '../data/calendar-events';
import {
  type EventTemplate,
  type EventType,
  type NewEventInput,
  type RecurrenceConfig,
} from '../types/calendar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Calendar as DayPickerCalendar } from './ui/calendar';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Checkbox } from './ui/checkbox';
import { cn } from './ui/utils';

interface CreateEventPromptProps {
  onLaunch: (type?: EventType) => void;
}

const RecurrenceDays = [
  { label: 'S', value: 0 },
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
];

const defaultRecurrence: RecurrenceConfig = {
  enabled: false,
  daysOfWeek: [],
  occurrences: 4,
};

const toDisplayDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

const toDisplayTime = (value: string) => {
  const [hoursRaw, minutes = '00'] = value.split(':');
  const hours = Number(hoursRaw);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const normalized = hours % 12 === 0 ? 12 : hours % 12;
  return `${normalized.toString().padStart(2, '0')}:${minutes} ${suffix}`;
};

interface CreateEventWizardProps {
  open: boolean;
  onClose: () => void;
  initialType?: EventType;
  initialDate?: Date;
  onSubmit: (result: {
    inputs: NewEventInput[];
    toastTitle: string;
    toastDescription?: string;
  }) => void;
}

export const CreateEventWizard = ({
  open,
  onClose,
  initialType,
  initialDate,
  onSubmit,
}: CreateEventWizardProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(
    null,
  );
  const [selectedType, setSelectedType] = useState<EventType | undefined>(
    initialType,
  );
  const [date, setDate] = useState<Date>(
    initialDate ? new Date(initialDate) : new Date(),
  );
  const [time, setTime] = useState('11:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [recurrence, setRecurrence] = useState<RecurrenceConfig>(
    defaultRecurrence,
  );
  const [inviteSelections, setInviteSelections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setStep(initialType ? 2 : 1);
      setSelectedTemplate(null);
      setSelectedType(initialType);
      const nextDate = initialDate ? new Date(initialDate) : new Date();
      setDate(nextDate);
      setTime('11:00');
      setTitle('');
      setDescription('');
      setLocation('');
      setMaxParticipants(initialType === 'group' ? 10 : 2);
      setInviteSelections(
        new Set(
          connectedUsers
            .filter((user) => user.isRecentMatch)
            .map((user) => user.id),
        ),
      );
      setRecurrence(defaultRecurrence);
    }
  }, [open, initialType, initialDate]);

  useEffect(() => {
    if (selectedTemplate) {
      setTitle(selectedTemplate.title);
      setDescription(selectedTemplate.description);
      setLocation(selectedTemplate.defaultLocation);
      setTime(selectedTemplate.defaultTime);
      setSelectedType(selectedTemplate.type);
      setMaxParticipants(
        selectedTemplate.type === 'group'
          ? selectedTemplate.defaultMaxParticipants ?? 10
          : 2,
      );
    }
  }, [selectedTemplate]);

  const filteredTemplates = useMemo(() => {
    if (!selectedType) return eventTemplates;
    return eventTemplates.filter((template) => template.type === selectedType);
  }, [selectedType]);

  const handleTemplateClick = (template: EventTemplate) => {
    setSelectedTemplate(template);
    setSelectedType(template.type);
    setStep(2);
  };

  const toggleInvite = (id: string) => {
    setInviteSelections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const applyRecurrenceDay = (value: string) => {
    const intValue = Number(value);
    setRecurrence((current) => {
      const nextDays = current.daysOfWeek.includes(intValue)
        ? current.daysOfWeek.filter((day) => day !== intValue)
        : [...current.daysOfWeek, intValue];
      return { ...current, daysOfWeek: nextDays };
    });
  };

  const buildEventInputs = () => {
    const baseTime = toDisplayTime(time);
    const invites = Array.from(inviteSelections);
    const attendees = [
      { id: 'att-you', name: 'You', status: 'accepted' as const },
      ...invites.map((invite) => {
        const user = connectedUsers.find((candidate) => candidate.id === invite);
        return {
          id: `att-${invite}`,
          name: user?.name ?? 'Invitee',
          status: 'pending' as const,
        };
      }),
    ];

    if (!recurrence.enabled || recurrence.daysOfWeek.length === 0) {
      return [
        {
          title,
          type: selectedType ?? 'group',
          date,
          time: baseTime,
          location,
          description,
          attendees,
          maxParticipants: selectedType === 'group' ? maxParticipants : 2,
          tags: selectedTemplate?.tags ?? [],
          image: selectedTemplate?.bannerImage,
        },
      ] satisfies NewEventInput[];
    }

    const sortedDays = [...recurrence.daysOfWeek].sort((a, b) => a - b);
    const results: NewEventInput[] = [];
    let weekAnchor = new Date(date);
    weekAnchor.setHours(0, 0, 0, 0);
    weekAnchor.setDate(weekAnchor.getDate() - weekAnchor.getDay());

    for (let weekIndex = 0; weekIndex < recurrence.occurrences; weekIndex += 1) {
      sortedDays.forEach((day) => {
        const occurrence = new Date(weekAnchor);
        occurrence.setDate(weekAnchor.getDate() + day);
        const isBeforeStart = occurrence.getTime() < date.setHours(0, 0, 0, 0);
        if (isBeforeStart) return;
        results.push({
          title,
          type: selectedType ?? 'group',
          date: new Date(occurrence),
          time: baseTime,
          location,
          description,
          attendees,
          maxParticipants: selectedType === 'group' ? maxParticipants : 2,
          tags: selectedTemplate?.tags ?? [],
          image: selectedTemplate?.bannerImage,
        });
      });
      weekAnchor.setDate(weekAnchor.getDate() + 7);
    }

    if (results.length === 0) {
      return [
        {
          title,
          type: selectedType ?? 'group',
          date,
          time: baseTime,
          location,
          description,
          attendees,
          maxParticipants: selectedType === 'group' ? maxParticipants : 2,
          tags: selectedTemplate?.tags ?? [],
          image: selectedTemplate?.bannerImage,
        },
      ];
    }

    return results;
  };

  const handleSubmit = () => {
    const inputs = buildEventInputs();
    const inviteCount = inputs[0]?.attendees.length ? inputs[0].attendees.length - 1 : 0;
    const toastTitle = `${title || 'Event'} created`;
    const toastDescription = inviteCount
      ? `Invited ${inviteCount} friend${inviteCount === 1 ? '' : 's'}!`
      : undefined;
    onSubmit({ inputs, toastTitle, toastDescription });
    onClose();
  };

  const disableCreate = !title || !location || !time || !date;

  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : null)}>
      <DialogContent className="max-w-2xl rounded-2xl p-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-5">
          <DialogTitle className="text-lg font-semibold gradient-text">
            {step === 1 ? 'Pick a template' : 'Event details'}
          </DialogTitle>
          <Badge className="rounded-full border-0 bg-blue-50 text-blue-600">
            {selectedType ? (selectedType === 'group' ? 'Group' : '1:1') : 'All'}
          </Badge>
        </DialogHeader>

        <div className="border-t border-white/30" />

        {step === 1 ? (
          <div className="space-y-6 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-full text-xs',
                    !selectedType && 'bg-blue-50 text-blue-600',
                  )}
                  onClick={() => setSelectedType(undefined)}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-full text-xs',
                    selectedType === 'one-to-one' && 'bg-purple-50 text-purple-600',
                  )}
                  onClick={() => setSelectedType('one-to-one')}
                >
                  1:1 Pairing
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-full text-xs',
                    selectedType === 'group' && 'bg-green-50 text-green-600',
                  )}
                  onClick={() => setSelectedType('group')}
                >
                  Group Events
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateClick(template)}
                  className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100/60 to-purple-100/40" />
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{template.emoji}</span>
                      <Badge
                        className={cn(
                          'rounded-full border-0 text-xs',
                          template.type === 'group'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700',
                        )}
                      >
                        {template.type === 'group' ? 'Group' : '1:1'}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-body font-semibold text-foreground">
                        {template.title}
                      </h3>
                      <p className="text-subtext text-sm">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-subtext">
                      <CalendarIcon className="h-3 w-3" />
                      {template.defaultTime}
                      <MapPin className="ml-2 h-3 w-3" />
                      {template.defaultLocation}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-2 text-sm text-white"
                disabled={!selectedTemplate}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 px-6 py-5">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-xs text-gray-500"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Templates
              </Button>
              <div className="flex items-center gap-2 text-xs text-subtext">
                <CalendarIcon className="h-3 w-3" />
                {toDisplayDate(date)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Event title"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Where will you meet?"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex w-full items-center justify-between rounded-xl"
                      >
                        {toDisplayDate(date)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <DayPickerCalendar
                        mode="single"
                        selected={date}
                        onSelect={(value) => value && setDate(value)}
                        fromDate={new Date()}
                        toDate={
                          new Date(
                            new Date().getFullYear() + 1,
                            new Date().getMonth(),
                            new Date().getDate(),
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder="Share the vibe and what people should expect."
                  className="rounded-xl"
                />
              </div>

              {selectedType === 'group' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                      Max participants
                    </label>
                    <Input
                      type="number"
                      min={2}
                      value={maxParticipants}
                      onChange={(event) =>
                        setMaxParticipants(Number(event.target.value) || 2)
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                      Repeat weekly
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/60 p-3">
                      <Switch
                        checked={recurrence.enabled}
                        onCheckedChange={(checked) =>
                          setRecurrence((current) => ({
                            ...current,
                            enabled: checked,
                            daysOfWeek: checked
                              ? [date.getDay()]
                              : [],
                          }))
                        }
                      />
                      <span className="text-sm text-subtext">
                        {recurrence.enabled ? 'Enabled' : 'Off'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {recurrence.enabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                      Repeat on
                    </label>
                    <ToggleGroup
                      type="multiple"
                      className="flex gap-2"
                      value={recurrence.daysOfWeek.map(String)}
                      onValueChange={(values) => {
                        if (values.length === 0) return;
                        setRecurrence((current) => ({
                          ...current,
                          daysOfWeek: values.map((value) => Number(value)),
                        }));
                      }}
                    >
                      {RecurrenceDays.map((day) => (
                        <ToggleGroupItem
                          key={day.value}
                          value={String(day.value)}
                          onClick={() => applyRecurrenceDay(String(day.value))}
                          className={cn(
                            'size-9 rounded-full bg-white/70 text-sm text-subtext',
                            recurrence.daysOfWeek.includes(day.value)
                              ? 'bg-blue-500 text-white'
                              : '',
                          )}
                        >
                          {day.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-subtext">
                        Number of weeks
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={recurrence.occurrences}
                        onChange={(event) =>
                          setRecurrence((current) => ({
                            ...current,
                            occurrences: Math.max(1, Number(event.target.value) || 1),
                          }))
                        }
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    Invite friends
                  </h4>
                  <span className="text-xs text-subtext">
                    {inviteSelections.size} selected
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {connectedUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/30 bg-white/60 p-3 transition hover:border-blue-200"
                    >
                      <Checkbox
                        checked={inviteSelections.has(user.id)}
                        onCheckedChange={() => toggleInvite(user.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {user.name}
                          </span>
                          {user.isRecentMatch && (
                            <Badge className="rounded-full border-0 bg-purple-100 text-[10px] uppercase tracking-wide text-purple-700">
                              Recent
                            </Badge>
                          )}
                        </div>
                        {user.subtitle && (
                          <p className="text-xs text-subtext">{user.subtitle}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-subtext">
                {toDisplayDate(date)} · {toDisplayTime(time)} ·{' '}
                {selectedType === 'group'
                  ? `${inviteSelections.size} invite${inviteSelections.size === 1 ? '' : 's'}`
                  : 'Private 1:1'}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white"
                  disabled={disableCreate}
                  onClick={handleSubmit}
                >
                  Create event
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CreateEventPrompt = ({ onLaunch }: CreateEventPromptProps) => {
  return (
    <div className="glass-card relative overflow-hidden bg-gradient-to-r from-blue-50/60 to-cyan-50/60 p-6">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-tr from-purple-200/40 to-pink-200/40" />
      <div className="relative z-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h3 className="mt-4 text-section-header gradient-text">Start something new</h3>
        <p className="text-subtext">
          Create a 1:1 pairing or plan a group activity—whatever fits your flow.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 text-white"
            onClick={() => onLaunch('one-to-one')}
          >
            <UserRound className="mr-2 h-4 w-4" />
            1:1 Pairing
          </Button>
          <Button
            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-5 text-white"
            onClick={() => onLaunch('group')}
          >
            <Users className="mr-2 h-4 w-4" />
            Group Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPrompt;
