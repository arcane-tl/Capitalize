import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
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
  const userUID = useUserStore((state) => state.user?.uid);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Get screen width for chart width
  const screenWidth = Dimensions.get('window').width; // Adjusted for padding

  // Calculate totals using useMemo
  const totalPurchasePrice = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
  }, [assets]);

  const totalCurrentValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  }, [assets]);

  // Bar chart data with static colors
  const chartData = [
    {
      value: totalPurchasePrice,
      labelComponent: () => (
        // This changes the BarChart1 bottom label container style
        <View style={{ marginLeft: 0 }}>
          <Text 
            // This changes the BarChart1 bottom label style
            style={[
              { fontSize: 12,
                color: 'rgb(255, 255, 255)',
                marginLeft: '14%',
              },
            ]}
          >
            Purchase Value
          </Text>
        </View>
      ),
      frontColor: 'rgba(113, 232, 39, 0.7)', // Bar1 background color
      barBorderTopLeftRadius: 10, // This changes the BarChart2 top left corner radius
      barBorderTopRightRadius: 10, // This changes the BarChart2 top right corner radius
    },
    {
      value: totalCurrentValue,
      labelComponent: () => (
        // This changes the BarChart2 label container style
        <View style={{ marginBottom: 0 }}>
          <Text 
            // This changes the BarChart2 label style
            style={[
              { fontSize: 12,
                color: 'rgb(255, 255, 255)',
                marginLeft: '18%',
              },
            ]}
          >
            Current Value
          </Text>
        </View>
      ),
      frontColor: 'rgba(210, 42, 202,0.7)', // Bar2 background color
      barBorderTopLeftRadius: 10, // This changes the BarChart2 top left corner radius
      barBorderTopRightRadius: 10, // This changes the BarChart2 top right corner radius
    },
  ];

  // Configure y-axis labels
  const maxValue = Math.max(totalPurchasePrice, totalCurrentValue, 1) + 10000; // Y-axis max value
  const noOfSections = 4; // Number of sections on the y-axis
  const stepValue = maxValue / noOfSections;
  const yAxisLabelTexts = Array.from(
    { length: noOfSections + 1 },
    (_, i) => `${Math.round(i * stepValue / 1000)} k€`
  );

  return (
    <ScrollView
      // This changes the background color of the screen content container
      style={[
        { flex: 1, backgroundColor: 'rgba(0, 0, 0, 1)' },
      ]}
      // This changes the background color of the chart container
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10,
        alignItems: 'flex-start', // This aligns the chart Title
        backgroundColor: 'rgba(56, 103, 221, 0)', // Background color of the chart container
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Static blue
      ) : assets.length === 0 ? (
        <Text style={{ color: 'rgba(255, 255, 255, 1)', fontSize: 18 }}>No assets found.</Text>
      ) : (
        <>
          <View style={{ borderRadius: 20, alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '42%', padding:10, backgroundColor: 'rgba(46, 50, 61, 0.8)' }}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ color: 'rgba(255,255,255,1)', fontSize: 18, fontWeight: 'bold' }}> 
                Total Asset Values
              </Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <BarChart
                data={chartData}
                width={screenWidth - 110}
                height={200}
                yAxisLabelTexts={yAxisLabelTexts}
                noOfSections={noOfSections}
                maxValue={maxValue}
                xAxisColor='rgba(255, 255, 255, 1)' // X-axis color
                yAxisColor='rgba(255, 255, 255, 1)' // Y-axis color
                yAxisTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }} // Y-axis text color
                yAxisLabelWidth={50}
                rulesColor='rgba(255, 255, 255, 1)' // Color of the grid lines
                barWidth={140} // Width of the bars
                spacing={20} // Spacing between bars
                backgroundColor={'rgba(0, 0, 0, 0)'} // Chart area background color
              />
            </View>
          </View>
          <View style={{ marginTop: 20, borderRadius: 20, alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '42%', padding:10, backgroundColor: 'rgba(46, 50, 61, 0.8)' }}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ color: 'rgba(255,255,255,1)', fontSize: 18, fontWeight: 'bold' }}> 
                Individual Asset Values
              </Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <BarChart
                data={chartData}
                width={screenWidth - 110}
                height={200}
                yAxisLabelTexts={yAxisLabelTexts}
                noOfSections={noOfSections}
                maxValue={maxValue}
                xAxisColor='rgba(255, 255, 255, 1)' // X-axis color
                yAxisColor='rgba(255, 255, 255, 1)' // Y-axis color
                yAxisTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }} // Y-axis text color
                yAxisLabelWidth={50}
                rulesColor='rgba(255, 255, 255, 1)' // Color of the grid lines
                barWidth={140} // Width of the bars
                spacing={20} // Spacing between bars
                backgroundColor={'rgba(0, 0, 0, 0)'} // Chart area background color
              />
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}