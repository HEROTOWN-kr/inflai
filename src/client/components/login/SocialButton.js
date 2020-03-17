import React from 'react';
import Grid from '@material-ui/core/Grid';

function SocialButton(props) {
  const buttonStyle = {
    mainContainer: {
      backgroundColor: props.bgColor,
    },
    buttonIcon: {
    },
    buttonText: {
      color: props.textColor,
      fontWeight: 'bold'
    }
  };

  return (
    <div onClick={props.clicked}>
      <Grid container style={buttonStyle.mainContainer} className="main-container">
        <Grid container xs={3} className="button-icon">
          <img src={props.icon} />
        </Grid>
        <Grid container xs={9} justify="center" alignItems="center" style={buttonStyle.buttonText} className="button-text">
          {props.text}
        </Grid>
      </Grid>
    </div>
  );
}

export default SocialButton;
