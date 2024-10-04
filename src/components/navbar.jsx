import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Inbox as InboxIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom eco-friendly theme
const ecoFriendlyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#004d40', // Earthy green for AppBar
    },
    background: {
      default: '#2C6B2F', // Darker green background
      paper: '#004d40', // Slightly lighter green for paper elements like Drawer
    },
    text: {
      primary: '#E0E0E0', // Light text color for contrast
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#004d40', // Earthy green for AppBar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#004d40', // Lighter green for Drawer
          color: '#E0E0E0', // Light text color
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#2E8B57', // Darker green for hover state
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#3A8F3D', // Consistent with Drawer
          color: '#E0E0E0', // Light text color
        },
      },
    },
  },
});

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const DrawerList = (
    <Box
      sx={{ width: { xs: 150, sm: 200 } }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {['Routes', 'Starred'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={`/${text.toLowerCase()}`}>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <InboxIcon sx={{ color: '#E0E0E0' }} />
                ) : (
                  <MailIcon sx={{ color: '#E0E0E0' }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Contests', 'Userpoints', 'Feedback'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={`/${text.toLowerCase()}`}>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <InboxIcon sx={{ color: '#E0E0E0' }} />
                ) : (
                  <MailIcon sx={{ color: '#E0E0E0' }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={ecoFriendlyTheme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Municipal Waste Management
            </Typography>
            <IconButton onClick={handleMenuClick}>
              <Avatar
                alt="User Avatar"
                src="/path/to/avatar/image.jpg"
                sx={{ bgcolor: '#2C6B2F' }} // Darker green for Avatar
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: '#004d40', // Consistent with Drawer
                  color: '#E0E0E0', // Light text color
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My account</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar> */}
        <AppBar position="static" style={{ backgroundColor: '#004d40' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Municipal Waste Management
            </Typography>
            
              <Button color="inherit" href='/'>Home</Button>
            
            <Button color="inherit" href="/routes">Routes</Button>
            <Button color="inherit" href='/contests'>Contest</Button>
            <Button color="inherit">User Points</Button>
            <Button color="inherit" href='/userDetail'>User Details</Button>
            <Button color="inherit">Contact</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ '& .MuiPaper-root': { bgcolor: '#004d40', color: '#E0E0E0' } }}
        >
          {DrawerList}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Navbar;
