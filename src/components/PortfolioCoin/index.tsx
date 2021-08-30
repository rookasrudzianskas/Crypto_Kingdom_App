import React from 'react';
import {View, Text} from "../Themed";
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import {Image, Pressable} from "react-native";
import {useNavigation} from "@react-navigation/native";

export interface PortfolioCoinProps {
    portfolioCoin: {
        amount: number,
        coin: {
            id: string,
            image: string,
            name: string,
            symbol: string,
            currentPrice: number,

        }
    }
}

// @ts-ignore
const PortfolioCoin = (props: PortfolioCoinProps) => {

    const navigation = useNavigation();

    const {
        portfolioCoin: {
            amount,
            coin: {
                id,
                image,
                name,
                symbol,
                currentPrice,
            }
        },
    } = props;

    return (
        <Pressable onPress={() => navigation.navigate('CoinDetails', { id })} style={[styles.root, tw`items-center bg-blue-700`]}>
            <View style={tw`ml-5  bg-blue-700`}>
                <Image source={{uri: image}} style={[styles.image, tw``]} />
            </View>
                <View  style={tw`flex-1  bg-blue-700`}>
                    <Text style={[styles.name, tw` text-white ml-5 text-xl font-bold`]}>{name}</Text>
                    <Text style={[styles.symbol, tw`ml-5  text-white text-sm font-medium`]}>{symbol}</Text>
                </View>

                <View style={tw`flex flex-col  bg-blue-700 items-center justify-center`}>
                    <Text style={[styles.name, tw`ml-3 text-xl  text-white font-extrabold text-green-600`]}>${(amount * currentPrice).toFixed(3)}</Text>
                    <Text style={[styles.symbol, tw`mt-2 ml-9 text-sm  text-white font-bold`]}>{symbol} {(amount).toFixed(2)}</Text>
                </View>

        </Pressable>
    );
};

export default PortfolioCoin;
