import Slider from 'react-slick';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import React from 'react';

function SimpleSlider(props) {
  return (
    <div>
      <Slider {...props.settings}>
        {props.influencers.map(person => (
          <div key={person.url}>
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
      {/*<div className="influencer-list2">
        <div style={{ height: '142px' }} />
        <Paper className="paper">
          <Grid container justify="center">
            <Grid item>
              <div style={{ position: 'relative' }}>
                <div className="paper-content">
                  <img src="https://html.com/wp-content/uploads/flamingo.jpg" className="avatar" />
                  <div className="social-name">test</div>
                  <div className="social-type">test</div>
                  <img src="https://html.com/wp-content/uploads/flamingo.jpg" className="social-image" />
                  <div className="social-tags">test</div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>*/}
    </div>
  );
}

export default SimpleSlider;
