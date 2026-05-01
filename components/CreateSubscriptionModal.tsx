import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { icons } from '../constants/icons';

interface CreateSubscriptionModalProps {
  visible: boolean;
  onSubmit: (subscription: any) => void;
  onClose: () => void;
}

const categories = ['Entertainment', 'AI Tools', 'Developer Tools', 'Design', 'Productivity', 'Cloud', 'Music', 'Other'];

const categoryColors: Record<string, string> = {
  Entertainment: '#ff6b6b',
  'AI Tools': '#4ecdc4',
  'Developer Tools': '#45b7d1',
  Design: '#f9ca24',
  Productivity: '#6c5ce7',
  Cloud: '#a29bfe',
  Music: '#fd79a8',
  Other: '#636e72',
};

export default function CreateSubscriptionModal({ visible, onSubmit, onClose }: CreateSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const isValid = name.trim() && parseFloat(price) > 0 && selectedCategory && paymentMethod.trim();

  const handleSubmit = () => {
    if (!isValid) return;

    const now = dayjs();
    const renewalDate = frequency === 'Monthly' ? now.add(1, 'month') : now.add(1, 'year');

    const subscription = {
      id: `new-sub-${Date.now()}`,
      name: name.trim(),
      price: parseFloat(price),
      frequency,
      category: selectedCategory,
      status: 'active',
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.wallet,
      billing: frequency,
      color: categoryColors[selectedCategory] || '#636e72',
      currency: 'USD',
      paymentMethod: paymentMethod.trim(),
    };

    onSubmit(subscription);

    // Reset form
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setSelectedCategory('');
    setPaymentMethod('');

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="overFullScreen" transparent>
      <View className="modal-overlay">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable onPress={onClose} className="modal-close">
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>
          <ScrollView className="modal-body">
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <TextInput
                placeholder="Subscription name"
                value={name}
                onChangeText={setName}
                className="auth-input"
              />
            </View>
            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <TextInput
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                className="auth-input"
              />
            </View>
            <View className="auth-field">
              <Text className="auth-label">Payment Method</Text>
              <TextInput
                placeholder="e.g., Visa ending in 1234"
                value={paymentMethod}
                onChangeText={setPaymentMethod}
                className="auth-input"
              />
            </View>
            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                <Pressable
                  onPress={() => setFrequency('Monthly')}
                  className={clsx('picker-option', frequency === 'Monthly' && 'picker-option-active')}
                >
                  <Text className={clsx('picker-option-text', frequency === 'Monthly' && 'picker-option-text-active')}>
                    Monthly
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setFrequency('Yearly')}
                  className={clsx('picker-option', frequency === 'Yearly' && 'picker-option-active')}
                >
                  <Text className={clsx('picker-option-text', frequency === 'Yearly' && 'picker-option-text-active')}>
                    Yearly
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    className={clsx('category-chip', selectedCategory === cat && 'category-chip-active')}
                  >
                    <Text className={clsx('category-chip-text', selectedCategory === cat && 'category-chip-text-active')}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable
              onPress={handleSubmit}
              disabled={!isValid}
              className={clsx('auth-button', !isValid && 'auth-button-disabled')}
            >
              <Text className="auth-button-text">Create Subscription</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}