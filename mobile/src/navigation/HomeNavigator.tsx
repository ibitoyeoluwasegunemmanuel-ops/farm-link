import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

import FeedScreen from '../screens/home/FeedScreen';
import PostDetailScreen from '../screens/home/PostDetailScreen';
import CreatePostScreen from '../screens/home/CreatePostScreen';
import StoriesScreen from '../screens/home/StoriesScreen';
import ExploreScreen from '../screens/home/ExploreScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import MessagesScreen from '../screens/home/MessagesScreen';
import ChatScreen from '../screens/home/ChatScreen';
import FarmerDashboardScreen from '../screens/dashboard/FarmerDashboardScreen';
import BuyerDashboardScreen from '../screens/dashboard/BuyerDashboardScreen';
import DriverDashboardScreen from '../screens/dashboard/DriverDashboardScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={FeedScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="Stories" component={StoriesScreen} options={{ presentation: 'fullScreenModal' }} />
    <Stack.Screen name="Explore" component={ExploreScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="FarmerDashboard" component={FarmerDashboardScreen} />
    <Stack.Screen name="BuyerDashboard" component={BuyerDashboardScreen} />
    <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
  </Stack.Navigator>
);
