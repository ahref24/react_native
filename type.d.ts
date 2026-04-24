import type { ImageSourcePropType } from 'react-native';

declare global {
    interface TabeIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }
}

export {};