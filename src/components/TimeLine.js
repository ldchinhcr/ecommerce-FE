import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Box, Typography } from "@material-ui/core";
import ItemsInSelling from "./ItemsInSelling";
import ItemsPurchased from "./ItemsPurchased";
import ItemsSold from "./ItemsSold";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className="w-100 mb-5"
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "auto",
    margin: "10px 0px",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function TimeLine(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Items In Sellings" {...a11yProps(0)} />
        <Tab label="Buyed Stuff" {...a11yProps(1)} />
        <Tab label="Sold Items" {...a11yProps(2)} />
        <Tab label="Point Earned" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ItemsInSelling
          handleRootUpdate={props.handleRootUpdate}
          handleDetailUpdate={props.handleDetailUpdate}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ItemsPurchased />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ItemsSold />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div>In development...</div>
      </TabPanel>
    </div>
  );
}
