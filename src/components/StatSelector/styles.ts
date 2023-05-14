import {style} from "../../utils/styleUtils";

export const styles = style({
   wrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 20,
      padding: 20,
   },
   filterWrapper: {
      width: "fit-content",
   },
   fieldsWrapper: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      rowGap: 4,
      columnGap: 5,
   },
   fieldsOuterWrapper: {
      display: "flex",
      flexDirection: "column",
      height: 200,
      maxWidth: 400,
      padding: 10,
      overflow: "auto",
      gap: 25,
   },
   selectableFieldsWrapper: {
      display: "grid",
      alignItems: "center",
      gridTemplateColumns: "repeat(4, max-content)",
      height: 200,
      gap: 10,
   },
   filterButtons: {
      display: "flex",
      alignItems: "center",
      marginBlock: 30,
      gap: 5,
   }
})