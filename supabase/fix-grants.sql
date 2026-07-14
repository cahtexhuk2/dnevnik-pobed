grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.habits to authenticated;
grant select, insert, update, delete on public.habit_children to authenticated;
grant select, insert, update, delete on public.habit_checks to authenticated;
grant select, insert, update, delete on public.victories to authenticated;
grant select, insert, update, delete on public.shadow_entries to authenticated;
grant select, insert, update, delete on public.user_settings to authenticated;
