import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ActivityIndicator, ActivityIndicatorComponent} from "react-native";
import styles from "../../components/MarketCoin/style";
import tw from "tailwind-react-native-classnames";
import {AntDesign} from "@expo/vector-icons";
import PercentageChange from "../../components/PercentageChange";
import CoinPriceGraph from "../../components/CoinPriceGraph";
import {useNavigation, useRoute} from "@react-navigation/native";
import {API, graphqlOperation} from "aws-amplify";
import {getCoin, listPortfolioCoins} from "../../graphql/queries";
import AppContext from "../../utils/AppContext";

const historyString = JSON.stringify(
    [49436.324978116914,
    49195.06703693363,
    49505.19018153466,
    49902.31384685163,
    49622.042976664765,
    49392.447918847654,
    49670.56369991088,
    50501.037141345034,
    50953.51840817563,
    51207.23996437584,
    51545.82175744182,
    51287.70799552459,
    51341.35644229185,
    50608.2247402897,
    51136.15052712996,
    51131.789595611,
    51168.84324568567,
    51274.08540253334,
    51353.337433947876,
    51444.78828512682,
    51999.00814759561,
    52202.32347977574,
    52320.915246127704,
    52115.160034438544,
    52354.33106806803,
    52228.26803271614,
    52183.506133621464,
    52323.19102271347,
    51905.70841194988,
    52163.214648583176,
    52145.038800077054,
    51909.079549463866,
    51992.40196948642,
    51904.70068004216,
    51820.288855346684,
    51665.4776656716,
    51391.90391143333,
    51531.63956470861,
    51886.5132956805,
    52141.260866132485,
    51586.017410455745,
    51950.89679140388
]);

// state
// {
//     id: '1',
//         image: 'https://bitcoin.org/img/icons/opengraph.png?1628351347',
//     symbol: 'USD',
//     valueChange24H: -1.12,
//     valueChange1D: 3.342,
//     valueChange7D: -3.423,
//     valueUSD: 459342,
//     name: 'BTC',
//     currentPrice: 3423432,
//     amount: 2,
//
// }

const CoinDetailsScreen = () => {

    const [coin, setCoin] = useState({});
    const [loading, setLoading] = useState(false);
    const [portfolioCoin, setPortfolioCoin] = useState({});

    const {userId} = useContext(AppContext);

    const navigation = useNavigation();
    const route = useRoute();

    const fetchCoinData = async () => {
        setLoading(true);
        //
        // @ts-ignore
        if(!route.params?.id) {
            return;
        }
        //
        try {
            // @ts-ignore
            const response = await API.graphql(graphqlOperation(getCoin, { id: route.params.id }));
            console.log(response);
            // @ts-ignore
            setCoin(response.data.getCoin);
        //
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCoinData();
    }, []);



    const fetchPortfolioCoinData = async () => {
        setLoading(true);
        //
        // @ts-ignore
        if(!route.params?.id) {
            return;
        }
        console.log("userId");
        console.log(userId);

        try {
            // @ts-ignore
            const response = await API.graphql(graphqlOperation(listPortfolioCoins, { filter: {
                    and: {
            // @ts-ignore
                        coinId: { eq: route.params?.id },
                        userId: { eq: userId }
                    }
                }
            }));

            // @ts-ignore
            if (response.data.listPortfolioCoins.items.length > 0) {
                // @ts-ignore
                setPortfolioCoin(response.data.listPortfolioCoins.items[0])
            }

            // console.log("This is awesome response 🍚", response);
        } catch (e) {
            console.log("Failed 🍚", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()  => {
        fetchPortfolioCoinData();
    }, []);

    if(!coin) {
        return  <View style={tw`mt-96 flex items-center justify-center`}>
            <View style={tw`mb-10`}>
                <Text style={tw`text-xl text-blue-500 font-medium`}>The Coin Data is loading... 🚀</Text>
            </View>
            <View style={tw`flex items-center justify-center`}>
            <ActivityIndicator animating={true} color={"#9AA2F8"} size="large" hidesWhenStopped={true} />
            </View>
        </View>

    }
    const onSell = () => {
      navigation.navigate('CoinExchange', {isBuy: false, coin});

    };

    const onBuy = () => {
      navigation.navigate('CoinExchange', {isBuy: true, coin});
    };


    const [liked, setLiked] = useState(false);
    const [icon, setIcon] = useState('staro');

    const liking = () => {

        if(liked) {
            setLiked(false);
        } else {
            setLiked(true);
        }
        if(liked) {
            setIcon('star');
        } else {
            setIcon('staro');
        }
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <View style={tw`bg-blue-700 flex-1`}>
                <View style={tw`flex items-center mt-14 mb-10`}>
                    <Text style={tw`text-2xl font-bold text-white`}>Price Data</Text>
                </View>
            <View style={[styles.root, tw`items-center bg-blue-700`]}>
                <View style={tw`ml-5  bg-blue-700`}>
    {/*// @ts-ignore*/}
                    <Image source={{uri: coin.image}} style={[styles.image, tw``]} />
                </View>
                <View  style={tw`flex-1  bg-blue-700`}>
    {/*// @ts-ignore*/}
                    <Text style={[styles.name, tw` text-white ml-5 text-xl font-bold`]}>{coin.name}</Text>
    {/*// @ts-ignore*/}
                    <Text style={[styles.symbol, tw`ml-5  text-white text-sm font-medium`]}>{coin.symbol}</Text>
                </View>

                <View style={tw`flex flex-col  bg-blue-700 items-center justify-center`}>
                    <TouchableOpacity onPress={liking} style={tw`mr-5`} activeOpacity={0.8}>
    {/*// @ts-ignore*/}
                        <AntDesign name={icon} size={30} color={"#fff"} />
                    </TouchableOpacity>
                </View>

            </View>

            {/*chart goes in here*/}

    {/*// @ts-ignore*/}
            {coin?.priceHistoryString ? (

            <View style={tw`flex items-center`}>
    {/*// @ts-ignore*/}
                <Text style={tw`text-2xl text-white font-bold mt-5 mb-5`}>{coin.name} Price Graph</Text>
    {/*// @ts-ignore*/}
                <CoinPriceGraph dataString={coin.priceHistoryString} />
            </View>
            ) : (
                <View style={tw`flex items-center`}>
                    <Text style={tw`text-2xl text-white font-bold mt-10 mb-5`}>Price Graph (If Available)</Text>

                    <Text style={tw`text-sm text-white font-thin mt-5 mb-32 text-center`}>Currently the price graph is not available for this coin.</Text>
                </View>
            )}

        {/*    chart ends in here*/}


        {/*    bottom side with differences */}

            <View style={tw`flex flex-row mx-8 mt-10`}>
                <View style={tw`flex w-1/3`}>
                    <Text style={tw`text-lg text-white`}>Current Price</Text>
    {/*// @ts-ignore*/}
                    <Text style={tw`text-white text-xl font-bold`}>$ {coin.currentPrice}</Text>
                </View>

                <View style={tw`w-1/3 flex flex-row justify-between`}>
                <View style={tw`mx-8`}>
                    <Text style={tw`text-lg text-white mb-3`}>1 Hour</Text>
    {/*// @ts-ignore*/}
                    <PercentageChange style={{fontSize: 15}} value={coin.valueChange24H} />
                </View>

                <View style={tw`mx-2`}>
                    <Text style={tw`text-lg text-white mb-3`}>1 Day</Text>
    {/*// @ts-ignore*/}
                    <PercentageChange style={{fontSize: 15}} value={coin.valueChange1D} />
                </View>

                <View style={tw`mx-2`}>
                    <Text style={tw`text-lg text-white mb-3`}>7 Days</Text>
    {/*// @ts-ignore*/}
                    <PercentageChange style={{fontSize: 15}} value={coin.valueChange7D} />
                </View>
                </View>
            </View>

            <View style={tw`flex flex-row mt-10 mx-8`}>
                <View style={tw`flex flex-1`}>
                    <Text  style={tw`text-lg text-white font-bold`}>Position</Text>
                </View>

                <View  style={tw`flex `}>
                    <Text  style={tw`text-lg text-white`}>
    {/*// @ts-ignore*/}
                        <Text style={tw`font-bold`}>{coin.symbol}</Text> <Text style={tw`text-green-500 font-bold`}>{portfolioCoin?.amount || 0 }</Text> ($ {coin.currentPrice * portfolioCoin?.amount || 0 })
                    </Text>
                </View>
            </View>


            <View style={tw`absolute bottom-0 mb-10`}>
            <View style={tw`flex flex-row mx-10 `}>
                <View style={tw`w-1/2`}>
                    <TouchableOpacity activeOpacity={0.8} onPress={onBuy} >
                        <View style={tw`px-10 bg-green-500 py-5 mx-2 flex items-center border-4 border-green-400 rounded-xl  mt-10`}>
                            <Text style={tw`z-50 text-gray-100 text-center text-lg font-bold`}>Buy!</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={tw`w-1/2`}>
                    <TouchableOpacity activeOpacity={0.8} onPress={onSell} >
                        <View style={tw`px-10 py-5 mx-2 bg-red-500 flex items-center border-4 border-red-400 rounded-xl  mt-10`}>
                            <Text style={tw`text-gray-100 text-center text-lg font-bold`}>Sell!</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
            </View>
        </View>
    );
};

export default CoinDetailsScreen;
