import React, { useState, useMemo } from 'react';
import { Text, View, TextInput, FlatList } from 'react-native';
import {styled} from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/lib/SubscriptionContext";
const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return subscriptions;
    }

    const query = searchQuery.toLowerCase();
    return subscriptions.filter(subscription =>
      subscription.name.toLowerCase().includes(query) ||
      subscription.category?.toLowerCase().includes(query) ||
      subscription.plan?.toLowerCase().includes(query)
    );
  }, [searchQuery, subscriptions]);

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="mb-5">
        <Text className="text-2xl font-bold text-foreground mb-2">Subscriptions</Text>

        <View className="search-container">
          <TextInput
            className="search-input"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <View className="search-icon">
            <Text className="search-icon-text">🔍</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-muted-foreground text-center">
              {searchQuery ? `No subscriptions found for "${searchQuery}"` : 'No subscriptions available'}
            </Text>
          </View>
        }
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;