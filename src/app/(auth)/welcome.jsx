import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { COLORS, onboarding } from "../../constants/index";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from "expo-status-bar";

const Onboarding = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setactiveIndex] = useState(0);
  // const [isLastSlide, setIsLastSlide] = useState(false)
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView
      className="flex h-full items-center justify-between  p-2"
      style={{ backgroundColor: COLORS.background }}
    >
      <StatusBar backgroundColor={COLORS.background} />
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/signup");
        }}
        className="w-full flex justify-end items-end p-5 border-red-500"
      >
        <Text style={{ color: COLORS.text }}>Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[4px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[4px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
        onIndexChanged={(index) => setactiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text
                className=" text-3xl font-bold mx-10 text-center"
                style={{ color: COLORS.text }}
              >
                {item.title}
              </Text>
            </View>
            <Text
              className="text-md font-JakartaSemiBold text-center  mx-10 mt-3"
              style={{ color: COLORS.text }}
            >
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/signup")
            : swiperRef.current?.scrollBy(1)
        }
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
