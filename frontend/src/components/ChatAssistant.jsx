import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Fab, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  CircularProgress,
  Slide
} from '@mui/material';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { askAI } from '../api';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo! Saya asisten AI MangroveSight. Ada yang bisa saya bantu terkait data Mangrove di Teluk Balikpapan?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAI(userMessage);
      setMessages(prev => [...prev, { sender: 'bot', text: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Maaf, terjadi kesalahan saat menghubungi server AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            bottom: 90,
            right: 20,
            width: 350,
            height: 500,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ bgcolor: '#004D40', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bot size={20} /> AI Assistant
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Chat History */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#00BFA5' : '#f1f3f4',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  p: 1.5,
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                  boxShadow: 1
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', p: 1 }}>
                <CircularProgress size={20} sx={{ color: '#00BFA5' }} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tanya sesuatu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              sx={{ bgcolor: '#00BFA5', color: 'white', '&:hover': { bgcolor: '#00A08A' } }}
            >
              <Send size={18} />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={() => setIsOpen(!isOpen)}
        sx={{ 
          position: 'absolute', 
          bottom: 48, 
          right: 20, 
          zIndex: 2000,
          bgcolor: '#004D40',
          '&:hover': { bgcolor: '#00251A' }
        }}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </Fab>
    </>
  );
};

export default ChatAssistant;
