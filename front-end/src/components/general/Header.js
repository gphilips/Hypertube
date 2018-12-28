import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from "styled-components";
import classNames from 'classnames';
import {
  withStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { history } from "../../config/store";

import allTheActions from '../../actions';
import logo from "../../img/logo.png";
import avatar from "../../img/avatar.jpg";

const drawerWidth = 150;

const styles = theme => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    width: drawerWidth,
  },
});

const Wrapper = styled.div`
  display: flex;
`;
const Logo = styled.img`
  margin: ${props => props.margin ? "2vh 2vw" : "0"};
  width: ${props => props.width || 10}vw;
  min-width: 70px;
`;
const Nav = styled(AppBar)`
  background-color: ${props => props.theme.color.bg};
`;
const UserAvatar = styled(Avatar)`
  width: 35px;
  height: 35px;
`;
const Content = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;
const DrawerWrap = styled(Drawer)`
    width: ${drawerWidth};
    flex-shrink: 0;
`;
const DrawerHeader = styled.div``;

class Header extends React.Component {
  state = {
    openDrawer: false,
    anchorEl: null,
    isAuth: false,
  };

  handleDrawerOpen = () => {
    this.setState({ openDrawer: true });
  };

  handleDrawerClose = () => {
    this.setState({ openDrawer: false });
  };

  handleOpenMenuUser = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleCloseMenuUser = () => {
    this.setState({ anchorEl: null });
  };

  handleLogOut = () => {
    const { actions: { users: { logOut }}} = this.props;
    logOut();
    this.setState({ anchorEl: null });
    history.push('/sign-in');
  };

  renderSidebar = () => {
    const { classes, theme } = this.props;
    const { openDrawer } = this.state;
    const menuCategory = ['Popular', 'Action', 'Adventure', 'Animation', 'Comedy'];

    return (
      <DrawerWrap
        variant="persistent"
        anchor="left"
        open={openDrawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <DrawerHeader>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'ltr'
              ? <ChevronLeftIcon />
              : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuCategory.map((text, index) => (
            <ListItem button key={index}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </DrawerWrap>
    );
  }

  renderAuthHeader = () => {
    const { classes } = this.props;
    const { openDrawer, anchorEl } = this.state;
    const openMenuUser = !!anchorEl;

    return (
      <Nav
        position="static"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Content disableGutters={!openDrawer}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen}
            className={classNames(classes.menuButton, openDrawer && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          <Logo src={logo} alt={"logo"} />
          <IconButton
            aria-owns={openMenuUser ? 'menu-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpenMenuUser}
            color="inherit"
          >
            <UserAvatar alt={"avatar"} src={avatar} />
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openMenuUser}
            onClose={this.handleCloseMenuUser}
          >
            <MenuItem onClick={this.handleCloseMenuUser}>
              Settings
            </MenuItem>
            <MenuItem onClick={this.handleLogOut}>
              Logout
            </MenuItem>
          </Menu>
        </Content>
      </Nav>
    );
  }

  componentDidMount() {
    const { actions: { users: { verifyAuth }}} = this.props;
    verifyAuth();
  }

  render() {
    const { isAuth } = this.props;

    return (
      <Wrapper>
        {isAuth && this.renderAuthHeader()}
        {isAuth && this.renderSidebar()}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.users.isAuth,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(Header));
