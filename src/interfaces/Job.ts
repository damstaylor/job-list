interface Job {
  id: number
  key: string
  reference: string | null
  board: {
    key: string
    name: string
    type: string
    subtype: string
    environment: string
  }
  board_key: string
  name: string
  url: string | null
  picture: null
  summary: string
  location: {
    text: string
    lat: number
    lng: number
    gmaps: null
    fields: []
  }
  archive: null
  archived_at: null
  updated_at: string
  created_at: string
  sections: []
  culture: null
  responsibilities: null
  requirements: null
  benefits: null
  interviews: null
  skills: {
    name: string
    value: null
    type: null
  }[]
  languages: {
    name: string
    value: null
  }[]
  certifications: {
    name: string
    value: null
    type: null
  }[]
  courses: []
  tasks: {
    name: string
    value: null
    type: null
  }[]
  interests: []
  tags: {
    name: string
    value: string
  }[]
  metadatas: []
  ranges_float: []
  ranges_date: {
    name: string
    value_min: string
    value_max: string
  }[]
}

export default Job
