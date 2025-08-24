import React, { useState, memo } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import AppText from './AppText';

const OptimizedImage = memo(({ 
  source, 
  style, 
  placeholder, 
  placeholderStyle,
  resizeMode = 'cover',
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error || !source) {
    return (
      <View style={[style, placeholderStyle, { 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: COLORS.lightgray 
      }]}>
        {placeholder || (
          <AppText color={COLORS.white} size={1.5} bold={true}>
            ?
          </AppText>
        )}
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        source={source}
        style={style}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />
      {loading && (
        <View style={[
          style, 
          { 
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.lightgray
          }
        ]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
});

export default OptimizedImage;
