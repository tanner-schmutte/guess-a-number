import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton';

const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const RandNum = Math.floor(Math.random() * (max - min)) + min;
    if (RandNum === exclude) {
        return generateRandomBetween(min, max, exclude);
    } else {
        return RandNum;
    }
};

const GameScreen = (props) => {
    const initialGuess = generateRandomBetween(1, 100, props.userChoice);
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess]);

    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const { userChoice, onGameOver } = props;

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(pastGuesses.length);
        }
    }, [currentGuess, userChoice, onGameOver]);

    const nextGuessHandler = (direction) => {
        if (
            (direction === 'lower' && currentGuess < props.userChoice) ||
            (direction === 'higher' && currentGuess > props.userChoice)
        ) {
            Alert.alert("Don't be bullshittin...");
            return;
        }
        if (direction === 'lower') {
            currentHigh.current = currentGuess;
        }
        if (direction === 'higher') {
            currentLow.current = currentGuess;
        }

        const nextNumber = generateRandomBetween(
            currentLow.current + 1,
            currentHigh.current,
            currentGuess
        );

        setCurrentGuess(nextNumber);
        setPastGuesses((curPastGuesses) => [nextNumber, ...curPastGuesses]);
    };

    return (
        <View style={styles.screen}>
            <TitleText>Opponent's Guess</TitleText>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
                    <AntDesign name="caretdown" size={25} color="white" />
                </MainButton>

                <MainButton onPress={nextGuessHandler.bind(this, 'higher')}>
                    <AntDesign name="caretup" size={25} color="white" />
                </MainButton>
            </Card>
            <ScrollView>
                {pastGuesses.map((guess) => (
                    <View key={guess}>
                        <Text>{guess}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: 300,
        maxWidth: '80%',
    },
});

export default GameScreen;
