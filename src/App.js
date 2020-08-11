import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Route, BrowserRouter as Router, Link } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';

import './App.css';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}));

export default function App() {
  const [spinnerStyle, setSpinnerStyle] = useState({ display: 'none' });
  const [containerStyle, setContainerStyle] = useState({ opacity: 1.0 });
  const [language, setLanguage] = useState('');
  const [open, setOpen] = useState(false);
  const [allFrameworks, setFrameworks] = useState([]);
  const classes = useStyles();

  /**
   * @description getting framework data logic with fetch function
   * @param null
   * @returns {Promise<void>}
   * @see [http://google.com]
   */
  async function showFrameworks() {
    setSpinnerStyle({ display: 'block' });
    setContainerStyle({ opacity: 0.3 });
    try {
      const rawResponse = await fetch('http://gazetucom-env.eba-e6w32u3k.us-east-2.elasticbeanstalk.com/frameworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ 'name': language })
      });
      const res = await rawResponse.json();
      setSpinnerStyle({ display: 'none' });
      setContainerStyle({ opacity: 1.0 });
      setFrameworks(res[0].frameworks);
    } catch (e) {
      console.log("error occurred! =>", e);
      setFrameworks(['No Received data.']);
    }
  }

  /**
   * @description handle select events
   * @param {*} event 
   */
  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={`App ${classes.root}`} >
      <div className="main-container" style={containerStyle} >
        <div className="main-submit">
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">Languages</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={language}
              onChange={handleChange}
            >
              <MenuItem value="" key='none'>
                <em>None</em>
              </MenuItem>
              <MenuItem value={'Java'} key='Java'>Java</MenuItem>
              <MenuItem value={'Javascript'} key='Javascript'>Javascript</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={showFrameworks} className={classes.formControl} color="primary">SUBMIT</Button>
        </div>
        <Scrollbars style={{ width: '100%', height: 300 }} className='main-scroll'>
          <h3 className="title">Framework List</h3>
          <Divider />
          <div className="frameworks">
            <List component="nav" aria-label="main mailbox folders">
              {allFrameworks.map((element, index) => {
                return (<ListItem key={index} button><ListItemText primary={element} /></ListItem>)
              })}
            </List>
          </div>

        </Scrollbars>
      </div>
      <CircularProgress className="main-spinner" style={spinnerStyle} />
    </div >
  );
}
