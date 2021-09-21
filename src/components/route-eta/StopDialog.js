import React, { useState, useEffect, useContext } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import AppContext from '../../AppContext'
import SuccinctTimeReport from '../home/SuccinctTimeReport'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const StopDialog = ({open, stops, handleClose}) => {
  const { db:{routeList, stopList} } = useContext ( AppContext )
  const { i18n } = useTranslation()
  const [ routes, setRoutes ] = useState([])
  const classes = useStyles()

  useEffect(() => {
    if (stops === undefined) {
      setRoutes([])
      return
    }
    let _routes = [];
    Object.entries(routeList).forEach(([key, route]) => {
      stops.some( ([co, stopId]) => {
        if ( route.stops[co] && route.stops[co].includes(stopId) ) {
          _routes.push(key+'/'+route.stops[co].indexOf(stopId))
          return true
        }
        return false
      })
    })
    setRoutes(_routes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops])
  
  return (
    <Dialog open={open} onClose={handleClose} className={"stopDialog-dialog"}>
      <DialogTitle className={"stopDialog-title"} disableTypography>
        <Typography variant="h6" className={classes.dialogTitleTypo}>
          {stopList[stops[0][1]].name[i18n.language]}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className={classes.stopDialogClose}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          {routes.map(route => (
            <SuccinctTimeReport key={route} routeId={route} />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  stopDialogClose: {
    marginLeft: 'auto',
  },
  dialogTitleTypo: {
    display: 'flex',
    alignItem: 'center',
  },
  '@global': {
    '.stopDialog-dialog': {
      '& .MuiPaper-root': {
        width: '100%',
        marginTop: '90px',
        height: 'calc(100vh - 100px)'
      }
    },
    '.stopDialog-title': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.default : theme.palette.primary.main,
      color: theme.palette.type === 'dark' ? theme.palette.primary.main: theme.palette.text.primary,
    }
  }
}))

export default StopDialog