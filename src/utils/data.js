export const filterByParams = (dataSource, params) => {
  if (params) {
    if (Object.keys(params).length > 0) {
      return dataSource.filter((item) =>
        Object.keys(params).some((key) => {
          if (!params[key]) {
            return true;
          }

          if (params[key].includes(`${item[key]}`)) {
            return true;
          }

          return false;
        }),
      );
    }
  }

  return dataSource;
};

export const sortByParams = (dataSource, sorter) => {
  if (sorter) {
    // To sort we need a callback that compares two elements,
    // This callback goes through all the columns that the user
    // may have selected to sort
    return dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((key) => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }

          return;
        }

        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }

  return dataSource;
};

export const SINISTER_ENUM = { PROCESSING: 0, UNKNOWN: 1, NO_SINISTER: 2, SINISTER: 3 };
