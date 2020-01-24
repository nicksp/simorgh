import { flatten, isEmpty, isNil } from 'ramda';
import { TopRow, LeadingRow, RegularRow } from '../../FrontPageStoryRows';

const getTopRowType = rowLength => {
  switch (rowLength) {
    case 1:
      return { rowType: TopRow };
    case 2:
      return { rowType: LeadingRow };
    default:
      return null;
  }
};

const getRowTypes = rows => {
  const topRow = {
    stories: rows.topRow,
    displayImages: true,
    ...getTopRowType(rows.topRow.length),
  };
  const regularRows = rows.regularRows.map(row => ({
    stories: row,
    rowType: RegularRow,
    displayImages: true,
  }));
  const noImageRow = {
    stories: rows.noImageRow,
    rowType: RegularRow,
    displayImages: false,
  };
  return flatten([topRow, regularRows, noImageRow]).filter(
    row => !isEmpty(row.stories) && !isNil(row.stories),
  );
};

export default getRowTypes;
