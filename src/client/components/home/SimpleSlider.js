import Slider from 'react-slick';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import React from 'react';

function SimpleSlider(props) {
  return (
    <Slider {...props.settings}>
      {props.influencers.map(person => (
        <div>
          <div style={{ height: '142px' }} />
          <Paper className="paper">
            <div style={{ position: 'relative' }}>
              <div className="paper-content">
                <Grid container justify="center">
                  <Grid container justify="center">
                    <img src={person.url} className="avatar" />
                  </Grid>
                  <Grid container justify="center">
                    <div className="social-name">{person.name}</div>
                  </Grid>
                  <Grid container justify="center">
                    <div className="social-type">{person.type}</div>
                  </Grid>
                  <Grid container justify="center">
                    <img src={person.socialImage} className="social-image" />
                  </Grid>
                  <Grid container justify="center">
                    <div className="social-tags">{person.tags}</div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Paper>
        </div>
      ))}
    </Slider>
  );
}

export default SimpleSlider;