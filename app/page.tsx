import CityPicker from "@/components/CityPicker";
import { Card, Divider, Subtitle, Text, Title } from "@tremor/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#394F68] to-[#183B7E] p-5 md:p-10 flex flex-col justify-center items-center">
      <Card className="max-w-3xl mx-auto rounded-md">
        <Title className="text-[26px] font-bold text-center mb-10">
          Dariukyy Weather AI
        </Title>
        <Subtitle className="text-xl text-center text-gray-600">
          Powered by OpenAI, Next.js 14.2, Tailwind CSS, Tremor 3.14 + More!
        </Subtitle>
        <Divider className="my-10" />
        <Card className="rounded-lg bg-gradient-to-br from-[#394F68] to-[#183B7E]">
          <CityPicker />
        </Card>
      </Card>
    </div>
  );
}
