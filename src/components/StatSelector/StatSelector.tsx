import {useCallback, useState} from "react";

import {Modal, ModalProps} from "../Modal/Modal";
import {getClasses} from "../../utils/styleUtils";
import {styles} from "./styles";
import {SelectableField} from "../SelectableField/SelectableField";
import {Button} from "../Button/Button";
import {StatEnumType} from "../../activitiesAssembly/stats";
import {ActivityCategory, MapCategoryToStats, TActivityCategory} from "../../activitiesAssembly/categories";

interface IFieldsSelector extends ModalProps {
   onFieldSelectorClosed: (fields: StatEnumType[]) => void;
   alreadyChosenFields?: StatEnumType[];
}

const getAvailableFields = (filter: TActivityCategory, alreadyAdded: StatEnumType[] | undefined) => {
   const preFilteredOptions = MapCategoryToStats(filter).options;


   if (!alreadyAdded || alreadyAdded.length === 0) {
      return preFilteredOptions;
   }
   return preFilteredOptions.filter((option) => !alreadyAdded.find((addedOption) => option === addedOption))
}
const cssClasses = getClasses(styles);

export const StatSelector = ({onFieldSelectorClosed, open, alreadyChosenFields}: IFieldsSelector) => {
   const [selectedFields, setSelectedFields] = useState<StatEnumType[]>([]);
   const [filter, setFilter] = useState<TActivityCategory>("None")

   const handleSelection = useCallback((value: StatEnumType, selected: boolean) => {
      if (selected) {
         setSelectedFields((fields) => {
            fields.splice(selectedFields.findIndex((field) => field === value))
            return [...fields];
         })
      } else {
         setSelectedFields((fields) => [...fields, value]);
      }
   }, [selectedFields]);

   return <Modal open={open}
                 onClose={() => onFieldSelectorClosed(selectedFields)}>

      <div className={cssClasses.wrapper}>
         <h3>Select fields from below to add to your activity</h3>
         <div className={cssClasses.filterButtons}>{ActivityCategory.options.map((category) => <Button
            onClick={() => setFilter(category)}>{category}</Button>)}</div>
         <div
            className={cssClasses.fieldsWrapper}>{getAvailableFields(filter, alreadyChosenFields).map((field) => {
            return <SelectableField selectableStat={field}
                                    onClick={handleSelection}/>
         })}
         </div>
      </div>
   </Modal>
}