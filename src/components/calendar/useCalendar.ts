import {useCallback, useEffect, useState} from "react";
import {Temporal} from "@js-temporal/polyfill";
import {useAppSelector} from "../../store/store";
import {getCreationDate} from "../../store/authentication/authSelectors";
import {getActiveActivity} from "../../store/activity/activitySelector";
import {getCalendarEntries} from "../../store/activities/activitiesSelectors";
import {generateISOString} from "./utils";
import {CalendarType} from "../../store/activities/types";


const gregorian = Temporal.Calendar.from('gregory');

const getShowNextMonth = (month: number) => {
   return month !== Temporal.Now.plainDateISO().month
}

const getShowPreviousMonth = (month: number, creationDate: string) => {
   return month >= Temporal.Instant.fromEpochMilliseconds(Date.parse(creationDate)).toZonedDateTimeISO("UTC").month;
}

const getShowJump = (month: number) => {
   return month !== Temporal.Now.plainDateISO().month;
}

const getDate = (day: number, year: number, month: number) => {
   return generateISOString(gregorian.dateFromFields({day, year, month}).toLocaleString());
}

function getDates(date: Temporal.ZonedDateTime) {
   let day = 1;
   const daysInMonth = gregorian.daysInMonth(date);
   const singleDays = Array(daysInMonth).fill(0).map(() => day++);
   return singleDays.map((day) => getDate(day, date.year, date.month));
}

function getClampedDays(date: Temporal.ZonedDateTime, startIndex: number, numberOfDates: number) {
   return getDates(date).slice(startIndex, startIndex + numberOfDates);
}

export const useCalendar = () => {
   const [shownDate, setShownDate] = useState(Temporal.Now.zonedDateTime(gregorian));
   const [producedCalendar, setProducedCalendar] = useState<CalendarType>({});
   const creationDate = useAppSelector(getCreationDate);
   const [showNextMonth, setShowNextMonth] = useState(getShowNextMonth(shownDate.month));
   const activtiyIndex = useAppSelector(getActiveActivity).index;
   const calendarEntries = useAppSelector(getCalendarEntries(activtiyIndex));
   const [showPreviousMonth, setShowPreviousMonth] = useState(getShowPreviousMonth(shownDate.month, creationDate));
   const [showJump, setShowJump] = useState(getShowJump(shownDate.month));

   const constructCalendar = useCallback(() => {
      const calendar: CalendarType = {};
      const daysInCurrentMonth = gregorian.daysInMonth(shownDate);
      const previousMonth = Temporal.ZonedDateTime.from(shownDate).subtract({months: 1});
      const nextMonth = Temporal.ZonedDateTime.from(shownDate).add({months: 1});
      const spaceInCalendar = 35;
      const fillableSpace = spaceInCalendar - daysInCurrentMonth;
      const numberDatesInFront = Math.ceil(fillableSpace / 2);
      const numberDatesInBack = fillableSpace - numberDatesInFront;
      const startDayIndex = gregorian.daysInMonth(previousMonth) - numberDatesInFront;
      const dates = getClampedDays(previousMonth, startDayIndex, numberDatesInFront).concat(getDates(shownDate)).concat(getClampedDays(nextMonth, 0, numberDatesInBack));

      for (let i = 0; i < dates.length; i++) {
         const existentCellInfos = calendarEntries[dates[i]];
         const fNotInteract = i >= numberDatesInFront;
         const bNotInteract = i < dates.length - numberDatesInBack;
         const interactable = fNotInteract && bNotInteract;
         if (existentCellInfos) {
            calendar[dates[i]] = {...existentCellInfos, interactable};
         } else {
            calendar[dates[i]] = {
               marked: false,
               interactable,
            }
         }
      }
      setProducedCalendar(calendar);
   }, [shownDate, calendarEntries])

   useEffect(() => {
      constructCalendar();
   }, [calendarEntries])

   useEffect(() => {
      setShowPreviousMonth(getShowPreviousMonth(shownDate.month, creationDate));
      setShowNextMonth(getShowNextMonth(shownDate.month));
      setShowJump(getShowJump(shownDate.month));
      constructCalendar();
   }, [shownDate]);

   const decreaseMonth = useCallback(() => {
      const fold = shownDate.month - 1 === 0;
      const month = fold ? 12 : shownDate.month - 1;
      const year = fold ? shownDate.year - 1 : shownDate.year;
      setShowPreviousMonth(false);
      setShownDate(Temporal.ZonedDateTime.from(shownDate.with({month, year})));
   }, [shownDate]);

   const increaseMonth = useCallback(() => {
      const fold = shownDate.month + 1 > 12;
      const month = fold ? 1 : shownDate.month + 1;
      const year = fold ? shownDate.year + 1 : shownDate.year;
      setShowNextMonth(false);
      setShownDate(Temporal.ZonedDateTime.from(shownDate.with({month, year})));
   }, [shownDate]);

   const thisMonth = useCallback(() => {
      setShownDate(Temporal.Now.zonedDateTime(gregorian));
   }, []);

   return [producedCalendar, showPreviousMonth, showNextMonth, showJump, decreaseMonth, increaseMonth, thisMonth] as const;
}