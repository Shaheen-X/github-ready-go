-- Step 3: Add RLS policies to all existing tables

-- Activities table - users can view all public activities, but only modify their own
CREATE POLICY "Anyone can view public activities"
  ON public.activities
  FOR SELECT
  USING (is_public = true OR host_id = auth.uid());

CREATE POLICY "Users can create their own activities"
  ON public.activities
  FOR INSERT
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "Users can update their own activities"
  ON public.activities
  FOR UPDATE
  USING (host_id = auth.uid());

CREATE POLICY "Users can delete their own activities"
  ON public.activities
  FOR DELETE
  USING (host_id = auth.uid());

-- Messages table - users can only see their own messages
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own messages"
  ON public.messages
  FOR UPDATE
  USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
  ON public.messages
  FOR DELETE
  USING (sender_id = auth.uid());

-- Notifications table - users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- Groups table - anyone can view, creators can modify
CREATE POLICY "Anyone can view groups"
  ON public.groups
  FOR SELECT
  USING (privacy_type = 'public' OR created_by_user_id = auth.uid());

CREATE POLICY "Users can create groups"
  ON public.groups
  FOR INSERT
  WITH CHECK (created_by_user_id = auth.uid());

CREATE POLICY "Creators can update their groups"
  ON public.groups
  FOR UPDATE
  USING (created_by_user_id = auth.uid());

-- GroupMembers table - members can view, admins can modify
CREATE POLICY "Group members can view membership"
  ON public.groupmembers
  FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.groupmembers gm
    WHERE gm.group_id = groupmembers.group_id
    AND gm.user_id = auth.uid()
  ));

CREATE POLICY "Users can join groups"
  ON public.groupmembers
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Group admins can update membership"
  ON public.groupmembers
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.groupmembers gm
    WHERE gm.group_id = groupmembers.group_id
    AND gm.user_id = auth.uid()
    AND gm.is_admin = true
  ));

-- Events table - public visibility
CREATE POLICY "Anyone can view public events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create events"
  ON public.events
  FOR INSERT
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can update their events"
  ON public.events
  FOR UPDATE
  USING (organizer_id = auth.uid());

-- Calendars table - users manage their own calendars
CREATE POLICY "Users can view their own calendars"
  ON public.calendars
  FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own calendars"
  ON public.calendars
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own calendars"
  ON public.calendars
  FOR UPDATE
  USING (owner_id = auth.uid());

-- CalendarEntries table - users manage their calendar entries
CREATE POLICY "Users can view their calendar entries"
  ON public.calendarentries
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.calendars c
    WHERE c.calendar_id = calendarentries.calendar_id
    AND c.owner_id = auth.uid()
  ));

CREATE POLICY "Users can create calendar entries"
  ON public.calendarentries
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.calendars c
    WHERE c.calendar_id = calendarentries.calendar_id
    AND c.owner_id = auth.uid()
  ));

-- Activity Places - public read access
CREATE POLICY "Anyone can view activity places"
  ON public.activityplaces
  FOR SELECT
  USING (true);

-- Bookings - users manage their own bookings
CREATE POLICY "Users can view their bookings"
  ON public.bookings
  FOR SELECT
  USING (booked_by_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (booked_by_id = auth.uid());

CREATE POLICY "Users can update their bookings"
  ON public.bookings
  FOR UPDATE
  USING (booked_by_id = auth.uid());

-- Feedback - users can view all, but only create their own
CREATE POLICY "Anyone can view feedback"
  ON public.feedback
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (given_by_user_id = auth.uid());

-- Coaches - public read access
CREATE POLICY "Anyone can view coaches"
  ON public.coaches
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create coach profiles"
  ON public.coaches
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Coaches can update their profiles"
  ON public.coaches
  FOR UPDATE
  USING (user_id = auth.uid());

-- Businesses - public read access
CREATE POLICY "Anyone can view businesses"
  ON public.businesses
  FOR SELECT
  USING (true);

-- Matches - participants can view their matches
CREATE POLICY "Participants can view their matches"
  ON public.matches
  FOR SELECT
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create matches"
  ON public.matches
  FOR INSERT
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Subscriptions - users manage their own
CREATE POLICY "Users can view their subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their subscriptions"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (user_id = auth.uid());

-- Transactions - users view their own
CREATE POLICY "Users can view their transactions"
  ON public.transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- Orders - users manage their own
CREATE POLICY "Users can view their orders"
  ON public.orders
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- AppUsages - users can view their own usage
CREATE POLICY "Users can view their app usage"
  ON public.appusages
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can track app usage"
  ON public.appusages
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- EcommerceProducts - public read access
CREATE POLICY "Anyone can view products"
  ON public.ecommerceproducts
  FOR SELECT
  USING (true);