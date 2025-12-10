import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';
import { useNutritionLog } from '../../hooks/NutritionLogContext';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { useThemeMode } from '../../hooks/ThemeContext';

interface NutritionCardProps {
  title: string;
  value: string;
  target: string;
  percentage: number;
  color: string;
}

const NutritionCard: React.FC<NutritionCardProps> = ({
  title,
  value,
  target,
  percentage,
  color,
}) => (
  <View style={styles.nutritionCard}>
    <View style={styles.nutritionHeader}>
      <Text style={styles.nutritionTitle}>{title}</Text>
      <Text style={styles.nutritionValue}>
        {value}
        <Text style={styles.nutritionTarget}>/{target}</Text>
      </Text>
    </View>
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  </View>
);

interface RecentScanProps {
  food: string;
  time: string;
  calories: number;
  isDark?: boolean;
}

const RecentScan: React.FC<RecentScanProps> = ({
  food,
  time,
  calories,
  isDark,
}) => (
  <View style={[styles.recentScan, isDark && styles.cardDark]}>
    <View style={styles.scanInfo}>
      <Text style={[styles.scanFood, isDark && styles.textLight]}>{food}</Text>
      <Text style={[styles.scanTime, isDark && styles.textMuted]}>{time}</Text>
    </View>
    <Text style={[styles.scanCalories, isDark && styles.textLight]}>
      {calories} cal
    </Text>
  </View>
);


const DAILY_GOALS = {
  calories: 2000,
  carbs: 250,
  protein: 120,
  fat: 65,
};

export default function HomeScreen() {
  const { entries } = useNutritionLog();
  const { isDark } = useThemeMode();


  const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const totalProtein = entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const totalFat = entries.reduce((sum, e) => sum + (e.fat || 0), 0);

  const caloriesRemaining = Math.max(0, DAILY_GOALS.calories - totalCalories);

  const carbsPct =
    DAILY_GOALS.carbs > 0 ? (totalCarbs / DAILY_GOALS.carbs) * 100 : 0;
  const proteinPct =
    DAILY_GOALS.protein > 0 ? (totalProtein / DAILY_GOALS.protein) * 100 : 0;
  const fatPct = DAILY_GOALS.fat > 0 ? (totalFat / DAILY_GOALS.fat) * 100 : 0;


  const recentEntries = [...entries].slice(-3).reverse();

  const handleScanFood = () => {
    router.push('/(tabs)/camera');
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, isDark && styles.textLight]}>
          Hey, You Are Back!
        </Text>
        <Text style={[styles.subtitle, isDark && styles.textMuted]}>
          Let's track your nutrition today
        </Text>
      </View>


      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanFood}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.scanGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Camera size={32} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.scanButtonText}>Scan Food</Text>
          <Text style={styles.scanButtonSubtext}>
            Take a photo to identify nutrition
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Today's Progress
          </Text>
          <TouchableOpacity>
            <TrendingUp size={20} color="#10B981" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={[styles.caloriesSummary, isDark && styles.cardDark]}>
          <View style={styles.caloriesLeft}>
            <Text style={[styles.caloriesNumber, isDark && styles.textLight]}>
              {caloriesRemaining}
            </Text>
            <Text style={[styles.caloriesLabel, isDark && styles.textMuted]}>
              calories remaining
            </Text>
          </View>
          <View style={styles.caloriesBreakdown}>
            <View style={styles.calorieBreakdownItem}>
              <Text
                style={[styles.breakdownValue, isDark && styles.textLight]}
              >
                {totalCalories}
              </Text>
              <Text
                style={[styles.breakdownLabel, isDark && styles.textMuted]}
              >
                consumed
              </Text>
            </View>
            <Text style={[styles.calorieOperator, isDark && styles.textMuted]}>
              -
            </Text>
            <View style={styles.calorieBreakdownItem}>
              <Text
                style={[styles.breakdownValue, isDark && styles.textLight]}
              >
                0
              </Text>
              <Text
                style={[styles.breakdownLabel, isDark && styles.textMuted]}
              >
                burned
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.nutritionGrid}>
          <View style={[styles.nutritionCard, isDark && styles.cardDark]}>
            <View style={styles.nutritionHeader}>
              <Text style={[styles.nutritionTitle, isDark && styles.textLight]}>
                Carbs
              </Text>
              <Text
                style={[styles.nutritionValue, isDark && styles.textLight]}
              >
                {totalCarbs}g
                <Text style={styles.nutritionTarget}>
                  /{DAILY_GOALS.carbs}g
                </Text>
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, Math.max(0, carbsPct))}%`,
                    backgroundColor: '#F97316',
                  },
                ]}
              />
            </View>
          </View>

          <View style={[styles.nutritionCard, isDark && styles.cardDark]}>
            <View style={styles.nutritionHeader}>
              <Text style={[styles.nutritionTitle, isDark && styles.textLight]}>
                Protein
              </Text>
              <Text
                style={[styles.nutritionValue, isDark && styles.textLight]}
              >
                {totalProtein}g
                <Text style={styles.nutritionTarget}>
                  /{DAILY_GOALS.protein}g
                </Text>
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, Math.max(0, proteinPct))}%`,
                    backgroundColor: '#3B82F6',
                  },
                ]}
              />
            </View>
          </View>

          <View style={[styles.nutritionCard, isDark && styles.cardDark]}>
            <View style={styles.nutritionHeader}>
              <Text style={[styles.nutritionTitle, isDark && styles.textLight]}>
                Fat
              </Text>
              <Text
                style={[styles.nutritionValue, isDark && styles.textLight]}
              >
                {totalFat}g
                <Text style={styles.nutritionTarget}>
                  /{DAILY_GOALS.fat}g
                </Text>
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, Math.max(0, fatPct))}%`,
                    backgroundColor: '#EF4444',
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Recent Scans
          </Text>
        </View>

        <View style={styles.recentScans}>
          {recentEntries.length === 0 ? (
            <Text
              style={[
                { fontSize: 14 },
                isDark ? styles.textMuted : { color: '#9CA3AF' },
              ]}
            >
              No scans yet. Try scanning your first meal!
            </Text>
          ) : (
            recentEntries.map((entry, index) => (
              <RecentScan
                key={entry.id ?? index}
                food={entry.name}
                time={formatTimeAgo(entry.timestamp)}
                calories={entry.calories || 0}
                isDark={isDark}
              />
            ))
          )}
        </View>
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
  textLight: {
    color: '#F9FAFB',
  },
  textMuted: {
    color: '#9CA3AF',
  },
  cardDark: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    borderWidth: 1,
    shadowOpacity: 0,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  scanButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanGradient: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  scanButtonSubtext: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  caloriesSummary: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  caloriesLeft: {
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#10B981',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  caloriesBreakdown: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calorieBreakdownItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  calorieOperator: {
    fontSize: 24,
    fontWeight: '300',
    color: '#D1D5DB',
  },
  nutritionGrid: {
    paddingHorizontal: 24,
  },
  nutritionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutritionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  nutritionTarget: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recentScans: {
    paddingHorizontal: 24,
  },
  recentScan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scanInfo: {
    flex: 1,
  },
  scanFood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  scanTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scanCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});
