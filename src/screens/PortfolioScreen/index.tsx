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
import NumberFormat from 'react-number-format';




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
            // console.log(response.data.getUser);
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
                <View>
                    <Image  source={image} style={[styles.image, tw`mt-8`]}/>
                </View>
                <View style={[styles.balanceContainer, tw`mb-16`]}>
                    <View style={[tw`mt-12`]}>
                        <Text style={tw`text-3xl text-gray-200 font-bold`}>Portfolio balance</Text>
                        <View style={tw`mt-2`}>
                            <Text style={tw`text-3xl text-white font-bold`}>$ <Text style={tw`text-4xl font-extrabold text-green-500 mt-5 text-center`}>
                                <NumberFormat value={balance} thousandSeparator={true} prefix={'$'} />
                            </Text></Text>
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
