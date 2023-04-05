import {GamificationModel} from "../types";
import {createSelector} from "@reduxjs/toolkit";

export const getActivities = ({activities}: GamificationModel) => activities;
export const getCalendarEntries = (index: number) => createSelector([getActivities], (activities) => {
   return activities[index].calendarEntries
})