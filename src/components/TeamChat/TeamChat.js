import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, Grid, Avatar, Button, TextField, IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Card, CardContent,
  Chip, Badge, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  Tab, Tabs, Menu, MenuItem, Tooltip, Fab, Snackbar, Alert, LinearProgress,
  InputAdornment, Collapse, ListItemButton, ListItemIcon
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import ChatIcon from '@mui/icons-material/Chat';
import ShareIcon from '@mui/icons-material/Share';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OnlineIcon from '@mui/icons-material/FiberManualRecord';
import { authService } from '../../services/userService';

// Mock team members data with enhanced info
const TEAM_MEMBERS = [
  { 
    id: '2124801030179', 
    name: 'Nguyễn Duy Dũng', 
    role: 'Lead Developer', 
    avatar: '👨‍💻',
    status: 'online',
    lastSeen: new Date()
  },
  { 
    id: '2124801030036', 
    name: 'Lương Nguyễn Khôi', 
    role: 'Frontend Dev', 
    avatar: '🎨',
    status: 'online',
    lastSeen: new Date(Date.now() - 10 * 60 * 1000)
  },
  { 
    id: '2124801030180', 
    name: 'Nguyễn Tiến Dũng', 
    role: 'Backend Dev', 
    avatar: '⚙️',
    status: 'away',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000)
  },
  { 
    id: '2124801030076', 
    name: 'Trương Bồ Quốc Thắng', 
    role: 'DevOps', 
    avatar: '🚀',
    status: 'online',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000)
  },
  { 
    id: '2124801030233', 
    name: 'Trần Lê Thảo', 
    role: 'UI/UX Designer', 
    avatar: '✨',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  { 
    id: '2124801030017', 
    name: 'Nguyễn Minh Khôi', 
    role: 'QA Engineer', 
    avatar: '🔍',
    status: 'online',
    lastSeen: new Date(Date.now() - 1 * 60 * 1000)
  },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chat-tabpanel-${index}`}
      aria-labelledby={`chat-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  );
}

function TeamChat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [fileUploadDialog, setFileUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadInitialMessages();
    loadSharedFiles();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInitialMessages = () => {
    // Mock chat messages
    const initialMessages = [
      {
        id: 1,
        sender: TEAM_MEMBERS[0],
        content: 'Hello team! 👋 Just finished implementing the new dashboard features. Ready for review!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
        reactions: [{ emoji: '👍', users: ['2124801030036', '2124801030076'] }],
        isStarred: false
      },
      {
        id: 2,
        sender: TEAM_MEMBERS[1],
        content: 'Great work! The UI looks amazing. I love the new gradient backgrounds! 🎨',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: 'text',
        reactions: [{ emoji: '❤️', users: ['2124801030179'] }],
        replyTo: 1
      },
      {
        id: 3,
        sender: TEAM_MEMBERS[2],
        content: 'Backend APIs are working perfectly with the new frontend. Great integration! 🔧',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: 'text',
        reactions: []
      },
      {
        id: 4,
        sender: TEAM_MEMBERS[3],
        content: 'Deployed to staging environment successfully! 🚀 Everything is running smoothly.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'text',
        reactions: [{ emoji: '🎉', users: ['2124801030179', '2124801030036', '2124801030180'] }]
      },
      {
        id: 5,
        sender: TEAM_MEMBERS[4],
        content: 'The user experience flow is intuitive. Testing feedback looks positive! ✨',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'text',
        reactions: []
      }
    ];
    setMessages(initialMessages);
  };

  const loadSharedFiles = () => {
    // Mock shared files
    const files = [
      {
        id: 1,
        name: 'IoT_Dashboard_Design.figma',
        type: 'design',
        size: '15.2 MB',
        uploadedBy: TEAM_MEMBERS[4],
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        icon: <ImageIcon />,
        preview: '/api/placeholder/300/200'
      },
      {
        id: 2,
        name: 'Database_Schema.pdf',
        type: 'document',
        size: '2.8 MB',
        uploadedBy: TEAM_MEMBERS[2],
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        icon: <PictureAsPdfIcon />,
        preview: null
      },
      {
        id: 3,
        name: 'Demo_Video.mp4',
        type: 'video',
        size: '45.7 MB',
        uploadedBy: TEAM_MEMBERS[0],
        uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        icon: <VideoFileIcon />,
        preview: '/api/placeholder/300/200'
      },
      {
        id: 4,
        name: 'API_Documentation.docx',
        type: 'document',
        size: '1.5 MB',
        uploadedBy: TEAM_MEMBERS[2],
        uploadedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        icon: <DescriptionIcon />,
        preview: null
      }
    ];
    setSharedFiles(files);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: currentUser ? TEAM_MEMBERS.find(m => m.id === currentUser.studentId) || TEAM_MEMBERS[0] : TEAM_MEMBERS[0],
      content: message,
      timestamp: new Date(),
      type: 'text',
      reactions: [],
      replyTo: replyTo?.id || null
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setReplyTo(null);
    showNotification('Message sent!', 'success');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileUploadDialog(true);
    }
  };

  const confirmFileUpload = () => {
    if (selectedFile) {
      const newFile = {
        id: sharedFiles.length + 1,
        name: selectedFile.name,
        type: selectedFile.type.startsWith('image/') ? 'image' : 
              selectedFile.type.startsWith('video/') ? 'video' : 'document',
        size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedBy: currentUser ? TEAM_MEMBERS.find(m => m.id === currentUser.studentId) || TEAM_MEMBERS[0] : TEAM_MEMBERS[0],
        uploadedAt: new Date(),
        icon: getFileIcon(selectedFile.type),
        preview: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null
      };

      setSharedFiles(prev => [newFile, ...prev]);
      
      // Also add a message about the file share
      const fileMessage = {
        id: messages.length + 1,
        sender: currentUser ? TEAM_MEMBERS.find(m => m.id === currentUser.studentId) || TEAM_MEMBERS[0] : TEAM_MEMBERS[0],
        content: `📎 Shared file: ${selectedFile.name}`,
        timestamp: new Date(),
        type: 'file',
        fileData: newFile,
        reactions: []
      };

      setMessages(prev => [...prev, fileMessage]);
      setFileUploadDialog(false);
      setSelectedFile(null);
      showNotification('File uploaded successfully!', 'success');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType.startsWith('video/')) return <VideoFileIcon />;
    if (fileType.includes('pdf')) return <PictureAsPdfIcon />;
    return <DescriptionIcon />;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'away': return '#ff9800';
      case 'offline': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = messageFilter === 'all' || 
                         (messageFilter === 'files' && msg.type === 'file') ||
                         (messageFilter === 'starred' && msg.isStarred);
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 2, 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
              <GroupIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Team Communication
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {TEAM_MEMBERS.filter(m => m.status === 'online').length} members online
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              size="small"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&::placeholder': { color: 'rgba(255,255,255,0.7)' }
                }
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Team Members Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ height: '100%', borderRadius: '16px', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Team Members ({TEAM_MEMBERS.length})
            </Typography>
            
            <List>
              {TEAM_MEMBERS.map((member) => (
                <ListItem key={member.id} sx={{ px: 1, borderRadius: '8px', mb: 1 }}>
                  <ListItemAvatar>
                    <Badge
                      color={member.status === 'online' ? 'success' : member.status === 'away' ? 'warning' : 'default'}
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                    >
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {member.avatar}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {member.role}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {member.status === 'online' ? 'Online' : 
                           member.status === 'away' ? 'Away' : 
                           `Last seen ${formatTime(member.lastSeen)}`}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Chat and Files Area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ height: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs */}
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab icon={<ChatIcon />} label="Chat" />
              <Tab icon={<ShareIcon />} label={`Files (${sharedFiles.length})`} />
            </Tabs>

            {/* Chat Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Messages Area */}
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto', 
                    p: 2,
                    maxHeight: 'calc(100vh - 350px)'
                  }}
                >
                  {filteredMessages.map((msg) => (
                    <Box key={msg.id} sx={{ mb: 2 }}>
                      {msg.replyTo && (
                        <Box sx={{ ml: 6, mb: 1, opacity: 0.7 }}>
                          <Typography variant="caption" color="text.secondary">
                            ↳ Replying to: {messages.find(m => m.id === msg.replyTo)?.content.substring(0, 50)}...
                          </Typography>
                        </Box>
                      )}
                      
                      <Box display="flex" gap={2} alignItems="flex-start">
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          {msg.sender.avatar}
                        </Avatar>
                        
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {msg.sender.name}
                            </Typography>
                            <Chip 
                              label={msg.sender.role} 
                              size="small" 
                              sx={{ height: 18, fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(msg.timestamp)}
                            </Typography>
                          </Box>
                          
                          <Paper 
                            sx={{ 
                              p: 2, 
                              bgcolor: msg.type === 'file' ? 'action.hover' : 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: '12px'
                            }}
                          >
                            {msg.type === 'file' && msg.fileData ? (
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  {msg.fileData.icon}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {msg.fileData.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {msg.fileData.size}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2">
                                {msg.content}
                              </Typography>
                            )}
                          </Paper>

                          {/* Message Actions */}
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            {msg.reactions.map((reaction, index) => (
                              <Chip
                                key={index}
                                label={`${reaction.emoji} ${reaction.users.length}`}
                                size="small"
                                sx={{ height: 24, fontSize: '0.75rem' }}
                              />
                            ))}
                            
                            <IconButton 
                              size="small" 
                              onClick={() => setReplyTo(msg)}
                              sx={{ ml: 'auto' }}
                            >
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Reply Preview */}
                {replyTo && (
                  <Collapse in={!!replyTo}>
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderTop: 1, borderColor: 'divider' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          ↳ Replying to {replyTo.sender.name}: {replyTo.content.substring(0, 100)}...
                        </Typography>
                        <IconButton size="small" onClick={() => setReplyTo(null)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Collapse>
                )}

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box display="flex" gap={1} alignItems="flex-end">
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: '12px',
                          bgcolor: 'background.default'
                        }
                      }}
                    />
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      multiple
                    />
                    
                    <IconButton 
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ bgcolor: 'action.hover' }}
                    >
                      <AttachFileIcon />
                    </IconButton>
                    
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      sx={{ borderRadius: '12px', minWidth: 'auto', px: 2 }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            {/* Files Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Shared Files ({sharedFiles.length})
                  </Typography>
                  
                  <Button
                    variant="contained"
                    startIcon={<FileUploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ borderRadius: '12px' }}
                  >
                    Upload File
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {sharedFiles.map((file) => (
                    <Grid item xs={12} sm={6} md={4} key={file.id}>
                      <Card 
                        sx={{ 
                          borderRadius: '12px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                          }
                        }}
                      >
                        {file.preview ? (
                          <Box
                            sx={{
                              height: 160,
                              backgroundImage: `url(${file.preview})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: '12px 12px 0 0'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 160,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'action.hover',
                              borderRadius: '12px 12px 0 0'
                            }}
                          >
                            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                              {file.icon}
                            </Avatar>
                          </Box>
                        )}
                        
                        <CardContent>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            {file.name}
                          </Typography>
                          
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                              {file.uploadedBy.avatar}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">
                              {file.uploadedBy.name}
                            </Typography>
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary" display="block">
                            {file.size} • {formatTime(file.uploadedAt)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* File Upload Dialog */}
      <Dialog 
        open={fileUploadDialog} 
        onClose={() => setFileUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected file: <strong>{selectedFile.name}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Size: {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileUploadDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmFileUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TeamChat; 