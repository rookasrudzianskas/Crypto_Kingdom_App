import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, FlatList} from "react-native";
import tw from "tailwind-react-native-classnames";
// @ts-ignore
import image from '../../../assets/images/Saly-10.png';
import styles from "./styles";
import PortfolioCoin from "../../components/PortfolioCoin";
import {API, graphqlOperation} from "aws-amplify";
import {getUserPortfolio} from "./queries";
import App from "../../../App";
import AppContext from "../../utils/AppContext";

// const portfolioCoins = [{
//     id: '1',
//     name: 'Virtual Dollars',
//     symbol: 'USD',
//     amount: 79.993,
//     valueUSD: 79.993,
//     image: 'https://bitcoin.org/img/icons/opengraph.png?1628351347',
// }, {
//     id: '2',
//     name: 'Bitcoin',
//     symbol: 'BTC',
//     image: 'https://bitcoin.org/img/icons/opengraph.png?1628351347',
//     amount: 90.993,
//     valueUSD: 90.993,
// }, {
//     id: '3',
//     name: 'Eutherium',
//     symbol: 'ETH',
//     amount: 100.993,
//     valueUSD: 100.993,
//     image: 'https://bitcoin.org/img/icons/opengraph.png?1628351347',
// }, {
//     id: '4',
//     name: 'Eutherium',
//     symbol: 'ETH',
//     amount: 100.993,
//     valueUSD: 100.993,
//     image: 'https://bitcoin.org/img/icons/opengraph.png?1628351347',
// }];



// @ts-ignore
const PortfolioScreen = (props) => {

    const [portfolioCoins, setPortfolioCoins] = useState([]);
    const {userId} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    const fetchPortfolio = async () => {
        setLoading(true);
        try {
            const response = await API.graphql(graphqlOperation(getUserPortfolio, {
                id: userId,
            }))

            // @ts-ignore
            console.log(response.data.getUser);
            // @ts-ignore
            setBalance(response.data.getUser.networth);
            // @ts-ignore
            setPortfolioCoins(response.data.getUser.portfolioCoins.items);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect( () => {
        fetchPortfolio();
    }, []);


    return (
        <View style={[styles.root, tw`bg-blue-700`]}>
            <>
                <Image  source={image} style={styles.image}/>
                <View style={[styles.balanceContainer, tw`mb-16`]}>
                    <View style={[tw`mt-12`]}>
                        <Text style={tw`text-3xl text-gray-200 font-bold`}>Portfolio balance</Text>
                        <View style={tw`mt-2`}>
                            <Text style={tw`text-3xl text-white font-bold`}>$ <Text style={tw`text-4xl font-extrabold text-green-500 mt-5 text-center`}>{balance}</Text></Text>
                        </View>
                    </View>
                </View>
            </>
            {/*<View style={tw`bg-blu`}>*/}
            <FlatList onRefresh={fetchPortfolio} refreshing={loading} showsVerticalScrollIndicator={false} style={{width: '100%'}} data={portfolioCoins} renderItem={({item}) => <PortfolioCoin portfolioCoin={item}  />}/>
            {/*</View>*/}
            </View>
    );
};

export default PortfolioScreen;
