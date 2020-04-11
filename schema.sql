-- create the table 
CREATE TABLE counties (
  ID INT PRIMARY KEY,
  CTY_NAME TEXT,
  CTY_ABBR TEXT,
  POP INT,
  MEDIAN_AGE REAL,
  OVER_65_TOTAL REAL,
  PERCENT_OVER_65 REAL
);

--drop table if adjustments need to be made
--ONLY DO THIS IF THE TABLE NEEDS TO BE ADJUSTED, comment out the line below to run
--drop table counties;

--check to see if table was created
select * from counties;

-- copy in data from cleaned csv
-- FROM statement will need to be changed for each user
COPY counties(ID, CTY_NAME, CTY_ABBR, POP, MEDIAN_AGE, OVER_65_TOTAL, PERCENT_OVER_65) 
FROM '/Users/CountiesData_Cleaned.csv' DELIMITER ',' CSV HEADER;