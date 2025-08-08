import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

type Props = {
  children?: React.ReactNode;
  title: string;
  style?: ViewStyle;
  left?: React.ReactNode;
  right?: React.ReactNode;
  subtitle?: string;
};

export default function ListItem({ title, subtitle, style, left, right }: Props) {
  return (
    <View style={[styles.row, style]}>
      {left}
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  subtitle: {
    color: theme.colors.subtext,
    fontSize: 13,
    lineHeight: 18,
  },
});


