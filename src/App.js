import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
//import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

const center = { lat: 48.8584, lng: 2.2945 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState((null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

 
  const originRef = useRef()

  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    //setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    //setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={600} top={0}  h='100%' w='55%' >
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%',  }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='550px'
        zIndex='1'
        height= '100%'
        marginLeft='-750px'
       
      >
        <HStack  flexDirection='column' marginTop='80px'>
          <Box flexGrow={1} my={20}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef}  />
            </Autocomplete>

            <ButtonGroup>
              <Button colorScheme='pink' type='submit' onClick={calculateRoute} marginLeft='100px' my={30}>
                Calculate Route
              </Button>
            </ButtonGroup>

          </Box>
          <Box flexGrow={1} >
            <Autocomplete>
              <Input type='text' placeholder='Destination' ref={destiantionRef}  mx={3} top='-80px' left='-15px'/>
            </Autocomplete>
          </Box>

         
        </HStack>
        <HStack  mt={4} justifyContent='space-between' >
          <Text marginLeft='160px'>Distance: {distance} </Text>
        </HStack>
      </Box>
    </Flex>
  )
}

export default App