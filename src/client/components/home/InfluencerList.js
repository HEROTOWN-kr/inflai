import React from 'react';
import { Box } from '@material-ui/core';
import SimpleSlider from './SimpleSlider';

function InfluencerList({
  FontSettings,
  settings,
  influencers
}) {
  return (
    <Box px={{ xs: 2, md: 4 }} py={{ xs: 8, md: 16 }} className="influencer-list">
      <div className="main-title">
        <span style={FontSettings.aqua}>#</span>
                  INFLAi Influencers
      </div>
      <SimpleSlider settings={settings} influencers={influencers} />
    </Box>
  );
}

export default InfluencerList;
