import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
// @ts-ignore
import image from '../../../assets/images/Saly-31.png';
import styles from "./styles";
import {API, graphqlOperation} from "aws-amplify";
// @ts-ignore
import {exchangeCoins} from "../../graphql/mutations";
import AppContext from "../../utils/AppContext";
import {listPortfolioCoins} from "../../graphql/queries";


interface CoinExchangeProps {

}

const USD_COIN_ID = 'eaca01c8-0650-44ec-864d-31b53d86c3b9';

const CoinExchangeScreen = () => {

     const route = useRoute();
     const navigation = useNavigation();

    // @ts-ignore
    const isBuy = route?.params?.isBuy;
    // @ts-ignore
    const coin = route?.params?.coin;
    // @ts-ignore
    const portfolioCoin = route?.params?.portfolioCoin;

    // console.log("This is a portfolio Coin statics", portfolioCoin);


    const [coinAmount, setCoinAmount] = useState('');
    const [coinUSDValue, setCoinUSDValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { userId } = useContext(AppContext);

    const maxUSD = 100000;//  @TODO fetch from API

    // console.log("This is a coinAmount Coin statics", coinAmount);

    useEffect(() => {
        // this fires then coinAmount changes

        const amount = parseFloat(coinAmount);
        if(!amount && amount !== 0) {
            setCoinAmount("");
            setCoinUSDValue("");
            return;
        }
        // setCoinAmount(amount.toString());
        setCoinUSDValue((amount * coin?.currentPrice).toString());


    }, [coinAmount]);


    useEffect(() => {
        // this fires then coinAmount changes

        const amount = parseFloat(coinUSDValue);
        if(!amount && amount !== 0) {
            setCoinAmount("");
            setCoinUSDValue("");
            return;
        }
        // setCoinAmount(amount.toString());
        setCoinAmount((amount / coin?.currentPrice).toString());


    }, [coinUSDValue]);

    const getPortfolioCoinId = async (coinId: string) => {
        try {
            // @ts-ignore
            const response = await API.graphql(graphqlOperation(listPortfolioCoins, { filter: {
                    and: {
                        // @ts-ignore
                        coinId: { eq: coinId },
                        userId: { eq: userId }
                    }
                }
            }));

            // console.log("This is the response from filter 🔥", response);

            // @ts-ignore
            if (response.data.listPortfolioCoins.items.length > 0) {
                // @ts-ignore
                return response.data.listPortfolioCoins.items[0].id
            } else {
                return null;
            }

            // console.log("This is awesome response 🍚", response);
        } catch (e) {
            console.log(e);
            return null;
        }
    }



    const placeOrder = async () => {
        if(isLoading) {
            return;
        }
        setIsLoading(true);


        try {
            const variables = {
                coinId: coin.id,
                isBuy,
                amount: parseFloat(coinAmount),
                usdPortfolioCoinId: await getPortfolioCoinId(USD_COIN_ID),
                coinPortfolioCoinId: await getPortfolioCoinId(coin.id),
            }

            // console.log("Variables", variables);

            const response = await API.graphql(graphqlOperation(exchangeCoins, variables));
            // @ts-ignore
            if(response.data.exchangeCoins) {
                navigation.navigate('Portfolio');
            } else {
                Alert.alert("Something bad happened 🚀", "There was an error exchanging coins");
            }
        } catch (e) {
            Alert.alert("Something bad happened 🚀", "There was an error exchanging coins");
            console.log("Something cool", e);
        } finally {
            setIsLoading(false);
        }
    }

    const onPlaceOrder = () => {
        if(isBuy && parseFloat(coinUSDValue) > maxUSD) {
            Alert.alert('Error', `Not enough USD coins. Max: ${maxUSD}`);
            return;
        }

        // @TODO could be the problem, required to add the !portfolioCoin
        if(!isBuy && (!portfolioCoin || parseFloat(coinAmount) > portfolioCoin.amount)) {
            Alert.alert('Error', `Not enough ${coin?.symbol} currency coins. Max: ${coin.amount || 0}`);
            return;
        }

        /// if we went through the ifs, we do the place order
        placeOrder();
    };




    // @ts-ignore
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? 'padding' : 'height'}
            // keyboardVerticalOffset={100}
            style={tw`bg-blue-700 flex-1`}>
            <View style={tw`items-center`}>
                <Text style={ [tw` mt-16 text-white text-3xl font-medium`]}>
                    {isBuy ? "Buy " : " Sell "}
                    {coin?.name}
                </Text>

                <View style={tw``}>
                    <Text style={tw`text-white text-xl font-medium mt-5`}>
                        1 {coin?.symbol}
                        {" = "}
                        ${coin?.currentPrice}
                    </Text>
                </View>

                <View style={tw`mt-10`}>
        {/*// @ts-ignore*/}
                    <Image style={styles.image [tw``]} source={image} />
                </View>

            </View>

            <View style={[styles.root, tw`mt-16 mx-10 items-center flex flex-1 -mt-32`]}>

                <View style={tw`flex items-center bg-blue-400 p-5 rounded-lg`}>
        {/*// @ts-ignore*/}
                    <TextInput keyboardType="decimal-pad" value={coinAmount} onChangeText={setCoinAmount} style={tw`bg-white px-6 py-3 font-bold text-gray-500 text-lg rounded-lg`} placeholder={"0"} />
                    <Text style={tw`text-white text-xl font-bold mt-3`}>{coin?.name}</Text>
                </View>

                <View style={tw``}>
                    <Text style={tw`text-2xl text-white font-bold`}>=</Text>
                </View>

                <View style={tw``}>
                    <View style={tw` flex items-center bg-blue-400 p-5 rounded-lg`}>
            {/*// @ts-ignore*/}
                        <TextInput keyboardType="decimal-pad" value={coinUSDValue} onChangeText={setCoinUSDValue}  style={tw`bg-white px-6 py-3 font-bold text-gray-500 text-lg rounded-lg`} placeholder={"0"} />
                        <Text style={tw`text-white text-xl font-bold mt-3`}>USD</Text>
                    </View>

                    {/*<Text>abc</Text>*/}
                </View>
            </View>

                {isLoading && <ActivityIndicator color={'white'} />}
            {isLoading ? (

                <View style={tw`mb-10 mx-10`} >
                    <View style={tw``}>
                        <View style={tw`px-16 py-5 bg-red-500 flex items-center border-4 border-red-400 rounded-xl  mt-10`}>
                            <Text style={tw` text-white text-center text-lg font-bold`}>The order is in the process!</Text>
                        </View>
                    </View>
                </View>

            ) : (

                <TouchableOpacity  onPress={onPlaceOrder} activeOpacity={0.8} style={tw`mb-10 mx-10`} >
                    <View style={tw``}>
                        <View style={tw`px-16 py-5 bg-green-500 flex items-center border-4 border-green-400 rounded-xl  mt-10`}>
                            <Text style={tw` text-white text-center text-lg font-bold`}>Place Order!</Text>
                        </View>
                    </View>
                </TouchableOpacity>

            )}

        </KeyboardAvoidingView>
    );
};

export default CoinExchangeScreen;
