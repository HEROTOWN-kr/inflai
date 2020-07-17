import React from 'react';
import { Grid, Box } from '@material-ui/core';
import Logo from '../../img/logo.png';

function SocialButton(props) {
  const {
    bgColor, textColor, link, clicked, icon, text
  } = props;
  const buttonStyle = {
    mainContainer: {
      backgroundColor: bgColor,
      borderRadius: '5px'
    },
    buttonIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '100%',
      margin: '0 auto',
      overflow: 'hidden',
      backgroundImage: `url(${icon})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat'
    },
    buttonText: {
      color: textColor,
      fontWeight: 'bold'
    }
  };

  return (
    <div style={buttonStyle.mainContainer} className="social-main-container" onClick={clicked}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={3}>
          <Box className="button-icon">
            <div style={buttonStyle.buttonIcon} />
          </Box>
        </Grid>
        <Grid item xs={9} style={buttonStyle.buttonText} className="button-text">
          {text}
        </Grid>
      </Grid>
    </div>
  );
}

export default SocialButton;


/*
<React.Fragment>

  {link
      ? (
          <a href={link}>
            <div onClick={clicked}>
              <Grid container style={buttonStyle.mainContainer} className="main-container">
                <img src={icon} />
                {/!* <Grid item>
                  <img src={icon} />
                </Grid> *!/}
                {/!* <Grid item justify="center" className="button-icon">
                  <img src={icon} />
                </Grid>
                <Grid item xs={8} style={buttonStyle.buttonText} className="button-text">
                  {text}
                </Grid> *!/}
              </Grid>
            </div>
          </a>
      )
      : (
          null
          /!* <div onClick={clicked} style={{ width: '100%' }}>
            <Grid container justify="center" alignItems="center" style={buttonStyle.mainContainer} className="main-container">
              <img src={icon} />
              {/!*<Grid item>
                <img src={icon} />
              </Grid>*!/}
              {/!* <Grid item className="button-icon">
                <img src={icon} />
              </Grid>
              <Grid item xs={8} style={buttonStyle.buttonText} className="button-text">
                {text}
              </Grid> *!/}

            </Grid>
          </div> *!/
      )
  }
</React.Fragment> */
