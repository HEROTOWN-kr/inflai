import Slider from 'react-slick';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Box } from '@material-ui/core';

function SimpleSlider(props) {
  return (
    <Slider {...props.settings} className="slider-influencer">
      {
          props.influencers.map(person => (
            <Box p={2} key={person.url} className="card-item">
              <Paper className="paper-item">
                <div className="item-content">
                  <img src={person.url} className="avatar" />
                  <Box my={3} className="social-name">{person.name}</Box>
                  <Box className="social-type">{person.type}</Box>
                  <Box my={3}>
                    <img src={person.socialImage} className="social-image" />
                  </Box>
                  <Box className="social-tags">{person.tags}</Box>
                </div>
              </Paper>
            </Box>
          ))
      }
    </Slider>
  );
}

export default SimpleSlider;
