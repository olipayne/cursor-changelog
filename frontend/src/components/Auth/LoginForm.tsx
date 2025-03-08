import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl,
  FormLabel,
  Input, 
  Heading, 
  Text, 
  VStack, 
  HStack,
  Divider,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGitHub } = useAuth();

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setIsEmailError(!isValid);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to Cursor Change Alerter!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">Login</Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isInvalid={isEmailError} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {isEmailError && (
                <FormErrorMessage>Please enter a valid email address</FormErrorMessage>
              )}
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
              loadingText="Logging in"
            >
              Login
            </Button>
          </VStack>
        </form>
        
        <Box position="relative" py={4}>
          <Divider />
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            px={3}
            color="gray.500"
          >
            Or
          </Text>
        </Box>
        
        <VStack spacing={3}>
          <Button
            width="full"
            colorScheme="red"
            onClick={loginWithGoogle}
            leftIcon={<span>G</span>}
          >
            Continue with Google
          </Button>
          
          <Button
            width="full"
            colorScheme="gray"
            onClick={loginWithGitHub}
            leftIcon={<span>G</span>}
          >
            Continue with GitHub
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default LoginForm; 