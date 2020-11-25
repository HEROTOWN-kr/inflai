import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { SupervisorAccount } from '@material-ui/icons';
import StyledImage from '../containers/StyledImage';
import StyledText from '../containers/StyledText';
import { AdvertiseTypes, Colors } from '../../lib/Сonstants';
import StyledSvg from '../containers/StyledSvg';
import noImage from '../../img/noImage.png';

function CampaignCard(props) {
  const {
    image, ctg1, ctg2, srchEnd, name, shrtDisc, participantsLength, cnt, proportion, onClick
  } = props;

  function calculateDates(date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(date);
    if (lastDate < currentDate) {
      return '마감';
    }
    const daysLag = Math.ceil(Math.abs(lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysLag;
  }

  return (
    <Box border="1px solid #eaeaea" overflow="hidden" borderRadius="10px" css={{ cursor: 'pointer' }} onClick={onClick}>
      <StyledImage width="100%" height="auto" src={image || noImage} />
      <Box p={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledText overflowHidden>
              <span style={{ color: Colors.pink }}>{`${AdvertiseTypes.mainType[ctg1]}/${AdvertiseTypes.subType[ctg1][ctg2]}`}</span>
              {` D-${calculateDates(srchEnd)}`}
            </StyledText>
          </Grid>
          <Grid item xs={12}>
            <StyledText overflowHidden fontWeight="bold" fontSize="16">
              {name}
            </StyledText>
          </Grid>
          <Grid item xs={12}>
            <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
              {shrtDisc}
            </StyledText>
          </Grid>
          <Grid item xs={12}>
            <Box pt={1}>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledSvg
                      component={SupervisorAccount}
                      color={Colors.grey5}
                      fontSize="20px"
                    />
                    <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
                      <span style={{ color: Colors.pink }}>{participantsLength}</span>
                      {`/${cnt}명`}
                    </StyledText>
                  </div>
                </Grid>
                <Grid item>
                  <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
                    {`${proportion}%`}
                  </StyledText>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box height="5px" borderRadius="50px" overflow="hidden" css={{ background: Colors.grey6 }}>
              <Box height="4px" width={`${proportion}%`} css={{ background: Colors.pink2 }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>

  );
}

export default CampaignCard;
