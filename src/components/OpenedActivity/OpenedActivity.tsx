import {ActivityProps, DateType, StatValuePair} from "../../store/activities/types";
import {getClasses} from "../../utils/styleUtils";
import {styles} from "./styles";
import {getAmericanDate} from "../calendar/utils";
import {useCallback, useMemo, useState} from "react";
import produce from "immer";
import {DisplayedProgress} from "../DisplayedProgress/DisplayedProgress";
import {Button} from "../../basicComponents/Button/Button";
import {ConfirmButton} from "../ConfirmButton/ConfirmButton";
import {useAppSelector} from "../../store/store";
import {getCell} from "../../store/activities/activitiesSelectors";
import {ActivityInput} from "../ActivityInput/ActivityInput";

interface OpenedActivityProps {
   activeActivity: { index: number, activity: ActivityProps },
   onConfirmProgress: (statValuePairs: StatValuePair[]) => void;
   onDeleteProgress: () => void;
   date: DateType,
}

const cssClasses = getClasses(styles);

export const OpenedActivity = ({
                                  activeActivity,
                                  date,
                                  onConfirmProgress,
                                  onDeleteProgress
                               }: OpenedActivityProps) => {

   const cell = useAppSelector(getCell(activeActivity.index, date));
   const cellMarked = useMemo(() => Boolean(cell), [cell]);

   const [values, setValues] = useState<StatValuePair[]>([]);

   const handleStatsChange = useCallback((pair: StatValuePair, index: number) => {
      if (!cellMarked) {
         setValues((old) => produce(old, newStats => {
            newStats[index] = pair;
         }));
      }
   }, [values]);

   const handleConfirm = useCallback(() => {
      if (!values.every((value) => value !== undefined)) {
         //todo: fehlermeldung einbauen, wenn value nicht vorhanden
         return;
      } else {
         onConfirmProgress(values);
      }
   }, [values])

   return <div className={cssClasses.mainWrapper}>
      <div className={cssClasses.title}>{getAmericanDate(date, {day: true, month: true})}</div>
      <div>
         {cellMarked && cell.statValuePairs && <>
             <small>Here is the overview of your activity</small>
             <div className={cssClasses.statsWrapper}>{cell.statValuePairs.map((pair, index) => {
                const {unit, statName, type} = activeActivity.activity.stats[index];
                return <DisplayedProgress value={pair.value} unit={unit} name={statName} inputType={type}/>
             })}
             </div>
         </>}
         {!cellMarked && <div className={cssClasses.inputWrapper}>
            {activeActivity.activity.stats.map((stat, index) =>
               <ActivityInput key={stat.statName} label={stat.statName}
                              onChange={(value) => handleStatsChange(value, index)}
                              stat={stat}/>
            )}</div>}
      </div>
      <div className={cssClasses.buttons}>
         {!cellMarked ? <Button
               onClick={handleConfirm}>Confirm progress</Button> :
            <ConfirmButton className={cssClasses.button} barColor={"red"} confirmTime={500}
                           onClick={onDeleteProgress}>Delete
               progress</ConfirmButton>}</div>

   </div>
}
