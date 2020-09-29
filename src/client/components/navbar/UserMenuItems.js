import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Divider, Grid } from '@material-ui/core';
import LogOutButton from '../login/LogOutButton';

function UserMenuItems(props) {
  const { user } = props;

  const userMenu = [
    {
      text: '계정정보',
      link: '/Profile'
    },
    {
      text: '마이 캠페인',
      link: '/Campaign/ongoing'
    },
    {
      text: '알림',
      link: '/Notifications'
    },
    {
      text: '소셜계정',
      link: '/Social'
    },
  ];

  return (
    <div className="user-popmenu">
      {user.type === '1'
        ? (
          <React.Fragment>
            <Link
              to="/Product"
            >
              <div className="pop-item"> 마케팅 요청</div>
            </Link>
            <Divider />
          </React.Fragment>
        )
        : null
            }
      {userMenu.map(item => (
        <div key={item.text}>
          <Link
            to={item.link}
          >
            <div className="pop-item">{item.text}</div>
          </Link>
          <Divider />
        </div>
      ))}
      <Grid container justify="center" className="logout">
        <Grid item>
          <Box my={2}>
            <LogOutButton {...props} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default UserMenuItems;
