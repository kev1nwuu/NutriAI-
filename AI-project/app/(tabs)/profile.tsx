import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  User,
  Settings,
  Target,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  LogOut,
  ChevronRight,
  CreditCard as Edit3,
  Award,
  TrendingUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '../../hooks/ThemeContext';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showArrow = true,
  rightComponent,
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingIcon}>{icon}</View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightComponent || (
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />}
      </View>
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);


  const { isDark, toggleTheme } = useThemeMode();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality would be implemented here.');
  };

  const handleGoals = () => {
    Alert.alert('Nutrition Goals', 'Goal setting functionality would be implemented here.');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings would be implemented here.');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy & Security', 'Privacy settings would be implemented here.');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help center would be implemented here.');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive' },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDark && { color: '#F9FAFB' }]}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.profileGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <User size={40} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.profileName}>Kevin Wu</Text>
          <Text style={styles.profileEmail}>Kevin Wu@gamil.com</Text>
        </LinearGradient>
      </View>

      <View style={[styles.statsContainer, isDark && styles.cardDark]}>
        <View style={styles.statItem}>
          <Award size={24} color="#F59E0B" strokeWidth={2} />
          <Text style={[styles.statValue, isDark && { color: '#F9FAFB' }]}>5</Text>
          <Text style={[styles.statLabel, isDark && { color: '#9CA3AF' }]}>Days Streak</Text>
        </View>
        <View style={styles.statItem}>
          <TrendingUp size={24} color="#10B981" strokeWidth={2} />
          <Text style={[styles.statValue, isDark && { color: '#F9FAFB' }]}>66</Text>
          <Text style={[styles.statLabel, isDark && { color: '#9CA3AF' }]}>Foods Scanned</Text>
        </View>

      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && { color: '#F9FAFB' }]}>
          App Settings
        </Text>
        <View style={[styles.settingsContainer, isDark && styles.cardDark]}>
          <SettingItem
            icon={<Bell size={20} color="#F59E0B" strokeWidth={2} />}
            title="Notifications"
            subtitle="Meal reminders and achievements"
            onPress={handleNotifications}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={notificationsEnabled ? '#10B981' : '#9CA3AF'}
              />
            }
            showArrow={false}
          />
          <SettingItem
            icon={<Settings size={20} color="#6B7280" strokeWidth={2} />}
            title="Dark Mode"
            subtitle="Toggle app appearance"
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme} 
                trackColor={{ false: '#E5E7EB', true: '#111827' }}
                thumbColor={isDark ? '#10B981' : '#9CA3AF'}
              />
            }
            showArrow={false}
          />
          <SettingItem
            icon={<Shield size={20} color="#8B5CF6" strokeWidth={2} />}
            title="Privacy & Security"
            subtitle="Manage your data and privacy"
            onPress={handlePrivacy}
          />
        </View>
      </View>

      <View className="section">
        <Text style={[styles.sectionTitle, isDark && { color: '#F9FAFB' }]}>
          Support
        </Text>
        <View style={[styles.settingsContainer, isDark && styles.cardDark]}>
          <SettingItem
            icon={<LogOut size={20} color="#EF4444" strokeWidth={2} />}
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && { color: '#6B7280' }]}>
          NutriAI Version 1.0.0
        </Text>
        <Text style={[styles.footerSubtext, isDark && { color: '#4B5563' }]}>
          Made with for your health
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#020617',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  profileGradient: {
    padding: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#D1FAE5',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDark: {
    backgroundColor: '#020617',
    borderColor: '#1F2937',
    borderWidth: 1,
    shadowOpacity: 0,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});
