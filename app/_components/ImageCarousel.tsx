"use client"

import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";

export default function ImageCarousel() {
  // Array con las rutas de tus imágenes
  const images = [
    "/hero/hero1.jpeg",
    "/hero/hero2.jpeg", // Agrega más imágenes si las tienes
    "/hero/hero3.jpeg",
    "/hero/hero4.jpeg",
    "/hero/hero5.jpeg",
  ];

  return (
    <div className="flex justify-center p-4">
      <Carousel
        className="w-[calc(100%-6rem)] max-w-lg"
        opts={{loop: true}}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-0 overflow-hidden">
                    <Image
                      src={image}
                      alt={`Hero image ${index + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                      priority={index === 0} // Carga prioritaria para la primera imagen
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}