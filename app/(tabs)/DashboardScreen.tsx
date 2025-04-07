import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useThemeStyles } from '@/components/ThemeUtils';
import { useUserStore } from '@/constants/userStore';
import { database } from '@/components/database/FirebaseConfig';
import { ref, get } from 'firebase/database';

// Define the Asset interface
interface Asset {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  currentValue: number;
  created: number;
}

export default function DashboardScreen() {
  // Access theme styles and user UID
  const themeStyles = useThemeStyles();
  const userUID = useUserStore((state) => state.user?.uid);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch assets from Firebase when the component mounts or userUID changes
  useEffect(() => {
    if (!userUID) {
      console.log('No user UID found, skipping fetch.');
      setLoading(false);
      return;
    }

    const fetchAssets = async () => {
      try {
        const assetsRef = ref(database, `users/${userUID}/assets`);
        const snapshot = await get(assetsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const assetsArray = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name || 'Unknown',
            description: data[key].description || '',
            purchasePrice: data[key].purchasePrice ?? 0,
            currentValue: data[key].currentValue ?? 0,
            created: data[key].created,
          }));
          setAssets(assetsArray);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [userUID]);

  // Get screen width for chart sizing
  const screenWidth = Dimensions.get('window').width;

  // Chart configuration using theme styles
  const chartConfig = {
    backgroundGradientFrom: themeStyles.graphBackgroundGradientFromColor,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: themeStyles.graphBackgroundGradientToColor,
    backgroundGradientToOpacity: 0.5,
    decimalPlaces: 0, // No decimal places for whole euro values
    color: () => themeStyles.graphBarBackgroundColor, // Dark background
    labelColor: () => themeStyles.graphBarLabelColor, // White labels
    useShadowColorFromDataset: false, // Avoid shadow color from dataset
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: 'rgba(255, 255, 255, 0.3)', // Light gray lines
    },
  };

  // Handle loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  console.log('graphBarBackgroundColor:', themeStyles.graphBarBackgroundColor);
  console.log('graphBackgroundGradientFromColor:', themeStyles.graphBackgroundGradientFromColor);
  console.log('graphBackgroundGradientToColor:', themeStyles.graphBackgroundGradientToColor);
  console.log('graphBarLayoutColor:', themeStyles.graphBarLayoutColor);
  console.log('graphBarLabelColor:', themeStyles.graphBarLabelColor);
  
  // Handle no assets case
  if (assets.length === 0) {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: themeStyles.containerStyle.backgroundColor,
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text style={themeStyles.textStyle}>No assets found.</Text>
      </ScrollView>
    );
  }

  // Process data for monthly sums chart
  const monthlySums = assets.reduce((acc, asset) => {
    if (asset.created) {
      const date = new Date(asset.created);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const key = `${year}-${month.toString().padStart(2, '0')}`; // e.g., "2023-01"
      acc[key] = (acc[key] || 0) + asset.currentValue;
    }
    return acc;
  }, {} as { [key: string]: number });

  const sortedMonths = Object.keys(monthlySums).sort(); // Sort chronologically
  const monthlyData = {
    labels: sortedMonths, // e.g., ["2023-01", "2023-02"]
    datasets: [
      {
        data: sortedMonths.map((key) => monthlySums[key]),
      },
    ],
  };

  // Process data for individual assets chart
  const assetNames = assets.map((asset) => asset.name);
  const assetValues = assets.map((asset) => asset.currentValue);
  const assetData = {
    labels: assetNames,
    datasets: [
      {
        data: assetValues,
      },
    ],
  };

  // Render the dashboard with two charts
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: themeStyles.containerStyle.backgroundColor,
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      {/* Monthly Sum Chart */}
      <Text style={[themeStyles.textStyle, { fontSize: 18, marginBottom: 10 }]}>
        Monthly Sum of Asset Values
      </Text>
      <BarChart
        data={monthlyData}
        width={screenWidth - 40} // Adjust for padding
        height={220}
        yAxisLabel="€" // Prepend euro symbol
        yAxisSuffix="" // Optional suffix
        fromZero={true} // Start y-axis at 0
        chartConfig={chartConfig}
        showBarTops={false} // Show values on top of bars
        showValuesOnTopOfBars={true} // Show values on top of bars
      />

      {/* Individual Assets Chart */}
      <Text style={[themeStyles.textStyle, { fontSize: 18, marginTop: 20, marginBottom: 10 }]}>
        Individual Asset Values
      </Text>
      <ScrollView horizontal={true}>
        <BarChart
          data={assetData}
          width={Math.max(screenWidth - 40, assetNames.length * 50)} // Dynamic width based on number of assets
          height={220}
          yAxisLabel="€"
          yAxisSuffix=""
          fromZero={true}
          chartConfig={chartConfig}
          showBarTops={false} // Show values on top of bars
          showValuesOnTopOfBars={true} // Show values on top of bars
        />
      </ScrollView>
    </ScrollView>
  );
}