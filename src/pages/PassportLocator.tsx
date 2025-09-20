import { useState } from "react"
import { Search, MapPin, Globe, Plane, Navigation } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ImmigrationOffice {
  state: string
  address: string
  type: string
  lat?: number
  lng?: number
}
interface QuickLink {
  title: string
  href: string
  color: string
  icon: React.ElementType
}

const immigrationOffices: ImmigrationOffice[] = [
  { state: "Abuja (FCT)", address: "NIS Headquarters, Airport Rd, Sauka, Abuja", type: "Passport Office", lat: 8.9911, lng: 7.3609 },
  { state: "Abia", address: "NIS Command, Umuahia, Abia State", type: "Passport Office", lat: 5.532, lng: 7.486 },
  { state: "Adamawa", address: "NIS Command, Jimeta-Yola, Adamawa State", type: "Passport Office", lat: 9.3265, lng: 12.3984 },
  { state: "Akwa Ibom", address: "NIS Command, Uyo, Akwa Ibom State", type: "Passport Office", lat: 5.0377, lng: 7.9128 },
  { state: "Anambra", address: "NIS Command, Awka, Anambra State", type: "Passport Office", lat: 6.2107, lng: 7.0741 },
  { state: "Bauchi", address: "NIS Command, Bauchi, Bauchi State", type: "Passport Office", lat: 10.3103, lng: 9.8439 },
  { state: "Bayelsa", address: "NIS Command, Yenagoa, Bayelsa State", type: "Passport Office", lat: 4.9247, lng: 6.2642 },
  { state: "Benue", address: "NIS Command, Makurdi, Benue State", type: "Passport Office", lat: 7.7336, lng: 8.5214 },
  { state: "Borno", address: "NIS Command, Maiduguri, Borno State", type: "Passport Office", lat: 11.8333, lng: 13.1500 },
  { state: "Cross River", address: "NIS Command, Calabar, Cross River State", type: "Passport Office", lat: 4.9589, lng: 8.3269 },
  { state: "Delta", address: "NIS Command, Asaba, Delta State", type: "Passport Office", lat: 6.2016, lng: 6.7319 },
  { state: "Ebonyi", address: "NIS Command, Abakaliki, Ebonyi State", type: "Passport Office", lat: 6.3249, lng: 8.1137 },
  { state: "Edo", address: "NIS Command, Benin City, Edo State", type: "Passport Office", lat: 6.3392, lng: 5.6174 },
  { state: "Ekiti", address: "NIS Command, Ado-Ekiti, Ekiti State", type: "Passport Office", lat: 7.6233, lng: 5.2214 },
  { state: "Enugu", address: "Independence Layout, Enugu", type: "Passport Office", lat: 6.4527, lng: 7.5103 },
  { state: "Gombe", address: "NIS Command, Gombe, Gombe State", type: "Passport Office", lat: 10.2897, lng: 11.1673 },
  { state: "Imo", address: "NIS Command, Owerri, Imo State", type: "Passport Office", lat: 5.4836, lng: 7.0333 },
  { state: "Jigawa", address: "NIS Command, Dutse, Jigawa State", type: "Passport Office", lat: 11.7004, lng: 9.3503 },
  { state: "Kaduna", address: "Independence Way, Kaduna", type: "Passport Office", lat: 10.5105, lng: 7.4165 },
  { state: "Kano", address: "No. 1 Miller Road, Bompai, Kano", type: "Passport Office", lat: 12.0022, lng: 8.5919 },
  { state: "Katsina", address: "NIS Command, Katsina, Katsina State", type: "Passport Office", lat: 12.9855, lng: 7.6170 },
  { state: "Kebbi", address: "NIS Command, Birnin Kebbi, Kebbi State", type: "Passport Office", lat: 12.4539, lng: 4.1970 },
  { state: "Kogi", address: "NIS Command, Lokoja, Kogi State", type: "Passport Office", lat: 7.8023, lng: 6.7333 },
  { state: "Kwara", address: "NIS Command, Ilorin, Kwara State", type: "Passport Office", lat: 8.4799, lng: 4.5418 },
  { state: "Lagos", address: "Alagbon Close, Ikoyi, Lagos", type: "Passport Office", lat: 6.4541, lng: 3.3947 },
  { state: "Nasarawa", address: "NIS Command, Lafia, Nasarawa State", type: "Passport Office", lat: 8.4939, lng: 8.5150 },
  { state: "Niger", address: "NIS Command, Minna, Niger State", type: "Passport Office", lat: 9.6139, lng: 6.5569 },
  { state: "Ogun", address: "NIS Command, Abeokuta, Ogun State", type: "Passport Office", lat: 7.1500, lng: 3.3500 },
  { state: "Ondo", address: "NIS Command, Akure, Ondo State", type: "Passport Office", lat: 7.2526, lng: 5.1931 },
  { state: "Osun", address: "NIS Command, Osogbo, Osun State", type: "Passport Office", lat: 7.7825, lng: 4.5418 },
  { state: "Oyo", address: "NIS Command, Ibadan, Oyo State", type: "Passport Office", lat: 7.3775, lng: 3.9470 },
  { state: "Plateau", address: "NIS Command, Jos, Plateau State", type: "Passport Office", lat: 9.8965, lng: 8.8583 },
  { state: "Rivers", address: "Amadi-Ama, Port Harcourt, Rivers State", type: "Passport Office", lat: 4.8156, lng: 7.0498 },
  { state: "Sokoto", address: "NIS Command, Sokoto, Sokoto State", type: "Passport Office", lat: 13.0667, lng: 5.2333 },
  { state: "Taraba", address: "NIS Command, Jalingo, Taraba State", type: "Passport Office", lat: 8.8833, lng: 11.3667 },
  { state: "Yobe", address: "NIS Command, Damaturu, Yobe State", type: "Passport Office", lat: 11.7460, lng: 11.9608 },
  { state: "Zamfara", address: "NIS Command, Gusau, Zamfara State", type: "Passport Office", lat: 12.1628, lng: 6.6646 },
]
const quickLinks: QuickLink[] = [
  {
    title: "Apply for Nigerian Passport Online",
    href: "https://passport.immigration.gov.ng",
    color: "bg-primary-50 hover:bg-primary-100 text-primary-600",
    icon: Globe,
  },
  {
    title: "Visa Application Centers Worldwide",
    href: "https://globalvisaonline.com/",
    color: "bg-blue-50 hover:bg-blue-100 text-blue-600",
    icon: Plane,
  },
  {
    title: "Locate Immigration Offices (Global)",
    href: "https://www.uscis.gov/",
    color: "bg-green-50 hover:bg-green-100 text-green-600",
    icon: MapPin,
  },
  {
    title: "Tourist Visa – African Countries",
    href: "https://johannesburg.foreignaffairs.gov.ng/" ,
    color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-600",
    icon: Globe,
  },
  {
    title: "Tech Visa for Global Talent",
    href: "https://techvisa.emigr8visa.com/" ,
    color: "bg-purple-50 hover:bg-purple-100 text-purple-600",
    icon: Plane,
  },
  {
    title: "Global Visa Hub",
    href: "https://visaguide.world/" ,
    color: "bg-red-50 hover:bg-red-100 text-red-600",
    icon: MapPin,
  },
]


export default function PassportLocator() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const filteredOffices = immigrationOffices.filter((office) =>
    office.state.toLowerCase().includes(query.toLowerCase()) ||
    office.address.toLowerCase().includes(query.toLowerCase())
  )

  const handleViewMap = (office: ImmigrationOffice) => {
    if (office.lat && office.lng) {
      navigate(`/maps?lat=${office.lat}&lng=${office.lng}&state=${encodeURIComponent(office.state)}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
     
      <div className="text-center space-y-2">
        <h1 className="text-lg lg:text-3xl font-bold flex items-center justify-center gap-2">
          {/* <Globe className="w-7 h-7 text-primary-600" /> */}
          Global Passport & Visa Services
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Search online links or nearest immigration offices for passport and visa services.
        </p>
      </div>

      
      <div className="flex items-center gap-2 bg-gray-50 border rounded-xl px-4 py-2 shadow-sm">
        <Search className="w-5 h-5 text-sm text-gray-400" />
        <input
          type="text"
          placeholder="Search by state, city, or service..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {quickLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 border rounded-xl transition ${link.color}`}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{link.title}</span>
          </a>
        ))}
      </div>


      {/* Search Results */}
      <div className="bg-white shadow rounded-xl p-4 space-y-3 max-h-96 overflow-y-auto">
        {filteredOffices.length > 0 ? (
          filteredOffices.map((office, idx) => (
        <div
            key={idx}
            className="p-3 border rounded-lg hover:bg-gray-50 transition flex items-center justify-between"
          >
            
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                {office.state}
              </h3>
              <p className="text-sm text-gray-600">{office.address}</p>
              <span className="text-xs text-gray-500">{office.type}</span>
            </div>

          
            {office.lat && office.lng && (
              <button
                onClick={() => handleViewMap(office)}
                className="flex items-center gap-2 text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Navigation className="w-5 h-5" />
              </button>
            )}
          </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">
            No results found. Try another location.
          </p>
        )}
      </div>
    </div>
  )
}
