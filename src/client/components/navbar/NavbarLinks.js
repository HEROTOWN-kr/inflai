import React from 'react';
import {
  Box, ClickAwayListener, Grid, Hidden, Popper
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as Scroll from 'react-scroll';

const Scroller = Scroll.scroller;

function NavbarLinks(props) {
  const { history } = props;

  const menuLinks = [
    {
      text: '성공사례',
      link: '/'
    },
    /* {
      text: '촬영서비스',
      link: '/'
    }, */
    {
      text: '파트너',
      link: '/'
    },
    {
      text: '캠페인',
      link: '/CampaignList'
    },
  ];

  function scrollTo() {
    history.push('/');
    setTimeout(() => {
      Scroller.scrollTo('target', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        ignoreCancelEvents: true
      });
    }, 1);
  }


  return (
    <Hidden smDown>
      <Box className="navbar-links">
        <Grid container spacing={8}>
          <Grid item>
            <a className="scroll-link" onClick={scrollTo}>인플라이소개</a>
          </Grid>
          {menuLinks.map(link => (
            <Grid item key={link.text}>
              <Link
                className="link"
                to={link.link}
              >
                {link.text}
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Hidden>
  );
}

export default NavbarLinks;
