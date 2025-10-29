import React, { useState } from "react";
import { Box, Button, Icon, Image, Input, Text, Stack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { IoMdClose } from "react-icons/io";
import { MarkdownTypewriter } from "react-markdown-typewriter";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

// Preguntas frecuentes y respuestas
const FAQS = [
  {
    question: "¿Qué es NDE y UDE?",
    answer:
      "**NDE** significa Nivel de Daño Económico y **UDE** significa Umbral de Daño Económico. Son valores que ayudan a tomar decisiones sobre el manejo de plagas en los cultivos, indicando cuándo una plaga comienza a causar **pérdidas económicas** y cuándo conviene **intervenir**.",
  },
  {
    question: "¿Cómo realiza la app el cálculo?",
    answer:
      "La app realiza los cálculos utilizando modelos agronómicos validados, considerando datos ingresados por el usuario como **tipo de cultivo**, **plaga**, **costos** y **precios**, para determinar el **NDE** y **UDE** y ayudar en la toma de decisiones.",
  },
  {
    question: "¿Cómo utilizar la app?",
    answer:
      "Para utilizar la app, primero debes **registrarte** con tus datos. Luego podés **cargar tus lotes**, ingresar información relevante y acceder a las **herramientas de cálculo** para obtener recomendaciones y análisis personalizados.",
  },
  {
    question: "¿Cómo me registro?",
    answer:
      "Para registrarte, hacé clic en el botón [registrarse](http://localhost:5173/) en la pantalla principal de la app y completá el formulario con tus datos personales. Luego seguí las instrucciones para **activar tu cuenta**.",
  },
  {
    question: "¿Qué es el manejo integrado de plagas?",
    answer:
      "El manejo integrado de plagas **(MIP)** es una estrategia que combina diferentes métodos de control (**biológicos**, **culturales**, **químicos**, etc.) para mantener las poblaciones de plagas por debajo de niveles que causen **daño económico**, priorizando la **sostenibilidad** y el **cuidado ambiental**.",
  },
  {
    question: "¿Cuáles son las especies beneficiosas en soja?",
    answer:
      "En soja, algunas especies beneficiosas son los enemigos naturales de plagas, como las **vaquitas** *(Coccinélidos)*, **crisopas**, **arañas** y **parasitoides**, que ayudan a controlar poblaciones de insectos perjudiciales.",
  },
  {
    question: "¿Cuáles son las especies peligrosas de soja?",
    answer:
      "Entre las especies peligrosas para la soja se encuentran **orugas defoliadoras** (Anticarsia, Rachiplusia), **trips**, **chinches** y otras plagas que pueden afectar el **rendimiento** y la **calidad** del cultivo.",
  },
  {
    question: "¿Cómo identifico el estadio de una plaga?",
    answer:
      "La identificación del estadio de una plaga depende de la especie. Generalmente se observa el **tamaño**, **color**, **presencia de alas** o características específicas. Consultá las **guías visuales** de la app para más detalles sobre cada plaga.",
  },
  {
    question: "Al tomar una decisión, ¿lo único que importa es el UDE?",
    answer:
      "No, el **UDE** es una herramienta importante, pero siempre se debe considerar el **contexto general**: condiciones del cultivo, clima, presencia de enemigos naturales, historial del lote y otros factores agronómicos.",
  },
  {
    question: "¿Es posible eliminar una plaga al 100%?",
    answer:
      "No, eliminar una plaga al 100% **no es posible ni recomendable**. El objetivo es mantener las poblaciones bajo control y evitar **daños económicos**, respetando el **equilibrio ecológico**.",
  },
  {
    question: "¿Cómo puedo averiguar la eficiencia de un producto?",
    answer:
      "La eficiencia de un producto puede consultarse en **ensayos oficiales**, **etiquetas** y **recomendaciones técnicas**. Es **importante** seguir las indicaciones del fabricante y consultar fuentes confiables.",
  },
  {
    question:
      "¿Qué cosas deben tenerse en cuenta a la hora de utilizar un producto?",
    answer:
      "Al utilizar un producto, considerá el **momento de aplicación**, **dosis**, **condiciones climáticas**, **equipo adecuado** y respetá las **recomendaciones de seguridad**. La app brinda información, pero **no recomienda** productos específicos.",
  },
  {
    question:
      "¿Qué condiciones predisponen a la aparición de una especie (ya sea beneficioso)?",
    answer:
      "Las condiciones que predisponen la aparición de una especie pueden ser **climáticas**, **presencia de hospederos**, **manejo del lote** y **prácticas culturales**. Consultá la app para información específica según la especie.",
  },
  {
    question: "¿Cómo mejorar la calidad de aplicación de un producto?",
    answer:
      "Para mejorar la calidad de aplicación, asegurate de **calibrar el equipo**, elegir la **boquilla adecuada**, aplicar en **condiciones climáticas favorables** y respetar las **dosis recomendadas**.",
  },
];

function TypingIndicator() {
  const bounce = keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
  `;

  return (
    <Box display="flex" gap="2px" px={2} py={1}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <Box
          key={i}
          display="inline-block"
          mx="2px"
          w="6px"
          h="6px"
          bg="gray.500"
          borderRadius="50%"
          style={{
            animation: `${bounce} 0.6s infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </Box>
  );
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function ChatbotFlotante() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [faqVisible, setFaqVisible] = useState(true);
  const [width, setWidth] = useState(450);
  const [height, setHeight] = useState(550);

  const toggleChat = () => setIsOpen(!isOpen);

  const onResize = (event, data) => {
    setWidth(data.size.width);
    setHeight(data.size.height);
  };

  const handleFaqButtonClick = (faq) => {
    setFaqVisible(false);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: faq.question },
      { from: "bot", text: faq.answer, isFaqAnswer: true },
    ]);
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    setFaqVisible(false);
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const match = FAQS.find(
      (faq) => normalize(faq.question) === normalize(input)
    );

    if (match) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: match.answer }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    setMessages((prev) => [...prev, { from: "bot", text: "typing" }]);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();
      const botMsg = {
        from: "bot",
        text: data.choices?.[0]?.message?.content || "Error: respuesta vacía",
      };

      setMessages((prev) =>
        prev.map((msg, i) => (i === prev.length - 1 ? botMsg : msg))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                from: "bot",
                text: "Ocurrió un error al contactar al asistente virtual",
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {isOpen && (
        <ResizableBox
          width={width}
          height={height}
          minConstraints={[300, 300]}
          maxConstraints={[window.innerWidth - 100, window.innerHeight - 100]}
          onResize={onResize}
          resizeHandles={["nw"]}
          style={{
            position: "fixed",
            bottom: 110,
            right: 100,
            zIndex: 1000,
          }}
        >
          <Box
            bg="white"
            color="black"
            p={6}
            borderRadius="md"
            boxShadow="lg"
            fontFamily="'Roboto'"
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            border="2px solid #4caf50"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box fontWeight="bold" fontSize="xl">
                Chatbot
              </Box>
              <Icon
                as={IoMdClose}
                boxSize={"1.5rem"}
                cursor="pointer"
                onClick={toggleChat}
              />
            </Box>

            <Box
              flex="1"
              overflowY="auto"
              bg="gray.50"
              p={3}
              mb={3}
              borderRadius="md"
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  textAlign={msg.from === "user" ? "right" : "left"}
                  mb={1}
                >
                  <Box
                    bg={msg.from === "user" ? "blue.100" : "gray.200"}
                    px={2}
                    py={1}
                    borderRadius="md"
                    display="inline-block"
                    fontWeight="normal"
                    whiteSpace="pre-line"
                    maxWidth="90%"
                  >
                    {msg.text === "typing" ? (
                      <TypingIndicator />
                    ) : msg.from === "bot" ? (
                      <MarkdownTypewriter delay={15}>
                        {msg.text}
                      </MarkdownTypewriter>
                    ) : (
                      msg.text
                    )}
                  </Box>
                </Box>
              ))}

              {faqVisible && (
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2} textAlign="center">
                    Preguntas frecuentes que podés hacerle
                  </Text>
                  <Stack gap={2} alignItems="stretch">
                    {FAQS.map((faq, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        colorScheme="green"
                        size="sm"
                        width="100%"
                        height="auto"
                        whiteSpace="normal"
                        textAlign="left"
                        justifyContent="flex-start"
                        fontWeight="normal"
                        px={2}
                        py={2}
                        onClick={() => handleFaqButtonClick(faq)}
                      >
                        {faq.question}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}

              {!faqVisible && (
                <Button
                  mt={2}
                  mb={3}
                  bg="green.700"
                  color="white"
                  _hover={{ bg: "green.600" }}
                  _active={{ bg: "green.800" }}
                  width="100%"
                  onClick={() => setFaqVisible(true)}
                >
                  Volver a las Preguntas Frecuentes
                </Button>
              )}
            </Box>

            <Box display="flex">
              <Input
                size="md"
                placeholder="Escribí algo..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                mr={2}
                disabled={isTyping}
              />
              <Button
                size="md"
                bg="green.700"
                color="white"
                _hover={{ bg: "green.600" }}
                _active={{ bg: "green.800" }}
                onClick={handleSend}
                disabled={isTyping}
              >
                Enviar
              </Button>
            </Box>
          </Box>
        </ResizableBox>
      )}

      <Button
        onClick={toggleChat}
        position="fixed"
        bottom={4}
        right={4}
        bg="transparent"
        borderRadius="full"
        boxSize="80px"
        p={0}
        _hover={{ transform: "scale(1.10)" }}
        _active={{ transform: "scale(0.97)" }}
      >
        <Image
          src="/chatbot-icon.jpg"
          alt="Chatbot"
          borderRadius="full"
          objectFit="cover"
          boxSize="full"
        />
      </Button>
    </>
  );
}
