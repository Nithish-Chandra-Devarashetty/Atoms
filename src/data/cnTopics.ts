export interface Topic {
    id: string;
    title: string;
    description: string;
    concepts: string[];
    quiz: QuizQuestion[];
    completed: boolean;
    readUrl?: string;
  }
  
  export interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
  }
  
  export const cnTopics: Topic[] = [
    {
      id: 'osi-tcpip-models',
      title: 'OSI and TCP/IP Models',
      description: 'OSI 7-layer model, TCP/IP 4-layer model, encapsulation and decapsulation',
      completed: false,
      readUrl: 'https://freedium.cfd/https://medium.com/@cybersecrealm/osi-model-and-tcp-ip-model-c2b6f9be262c',
      concepts: [
        'OSI 7-layer model: Application, Presentation, Session, Transport, Network, Data Link, Physical',
        'TCP/IP 4-layer model: Application, Transport, Internet, Network Access',
        'Encapsulation & Decapsulation'
      ],
      quiz: [
  {
    question: 'Which layer of the OSI model is responsible for ensuring reliable data transfer (error detection, flow control)?',
    options: [
      'Network Layer',
      'Transport Layer',
      'Data Link Layer',
      'Session Layer'
    ],
    correct: 1,
    explanation: 'The Transport layer (e.g., TCP) ensures reliable communication with error detection, retransmission, and flow control.'
  },
  {
    question: 'In the OSI model, which layer handles logical addressing and routing?',
    options: [
      'Physical Layer',
      'Network Layer',
      'Session Layer',
      'Data Link Layer'
    ],
    correct: 1,
    explanation: 'The Network layer (e.g., IP) is responsible for logical addressing and routing of packets across networks.'
  },
  {
    question: 'Which OSI layer is concerned with encryption, compression, and data translation?',
    options: [
      'Presentation Layer',
      'Application Layer',
      'Session Layer',
      'Transport Layer'
    ],
    correct: 0,
    explanation: 'The Presentation layer formats, encrypts, and compresses data so that the Application layer can understand it.'
  },
  {
    question: 'Which of the following is the correct order of OSI layers (top to bottom)?',
    options: [
      'Application → Presentation → Session → Transport → Network → Data Link → Physical',
      'Application → Session → Presentation → Transport → Data Link → Network → Physical',
      'Physical → Data Link → Network → Transport → Session → Presentation → Application',
      'Transport → Network → Data Link → Physical → Application → Session → Presentation'
    ],
    correct: 0,
    explanation: 'The OSI layers (top-down): Application, Presentation, Session, Transport, Network, Data Link, Physical.'
  },
  {
    question: 'Which layer is missing in the TCP/IP model compared to the OSI model?',
    options: [
      'Transport Layer',
      'Application Layer',
      'Presentation and Session Layers',
      'Network Access Layer'
    ],
    correct: 2,
    explanation: 'The TCP/IP model combines Presentation and Session into the Application layer, so they are not separate.'
  },
  {
    question: 'Which layer of the TCP/IP model corresponds to the Network and Data Link layers of OSI?',
    options: [
      'Application Layer',
      'Transport Layer',
      'Internet Layer',
      'Network Access Layer'
    ],
    correct: 3,
    explanation: 'The Network Access layer in TCP/IP handles both physical transmission and data link responsibilities.'
  },
  {
    question: 'What is the correct order of encapsulation when sending data?',
    options: [
      'Data → Segment → Packet → Frame → Bits',
      'Bits → Frame → Packet → Segment → Data',
      'Data → Packet → Segment → Frame → Bits',
      'Data → Frame → Segment → Packet → Bits'
    ],
    correct: 0,
    explanation: 'Encapsulation order: Application data → Transport (Segment) → Network (Packet) → Data Link (Frame) → Physical (Bits).'
  },
  {
    question: 'During decapsulation at the receiver side, which layer removes the header added by the Transport layer?',
    options: [
      'Application Layer',
      'Transport Layer',
      'Network Layer',
      'Data Link Layer'
    ],
    correct: 1,
    explanation: 'The Transport layer removes its header (TCP/UDP) during decapsulation at the receiver.'
  },
  {
    question: 'Which of the following best describes encapsulation?',
    options: [
      'Breaking data into smaller chunks for transmission',
      'Wrapping data with protocol-specific headers at each layer',
      'Removing protocol headers at each receiving layer',
      'Encrypting data before transmission'
    ],
    correct: 1,
    explanation: 'Encapsulation means each layer adds its own header (and sometimes trailer) around the data before passing it down.'
  },
  {
    question: 'In the TCP/IP model, the Internet layer provides:',
    options: [
      'Reliable end-to-end communication',
      'Routing and logical addressing',
      'Physical transmission of bits',
      'File transfer and email services'
    ],
    correct: 1,
    explanation: 'The Internet layer (IP) is responsible for routing, logical addressing, and delivering packets across networks.'
  }
]
    },
    {
      id: 'tcp-vs-udp',
      title: 'TCP vs UDP',
      description: 'Comparison of TCP and UDP, ports, and sockets',
      completed: false,
      readUrl: 'https://medium.com/@abhirup.acharya009/understanding-tcp-and-udp-building-blocks-of-connectivity-ec96e208b852',
      concepts: [
        'TCP: Connection-oriented, reliable, slower, 3-way handshake',
        'UDP: Connectionless, faster, no reliability or order',
        'Ports (well-known and ephemeral), sockets'
      ],
      quiz: [
  {
    question: 'Which of the following is true about TCP?',
    options: [
      'Connectionless, unreliable, faster',
      'Connection-oriented, reliable, slower',
      'Used for real-time applications like video streaming',
      'No flow control or congestion control'
    ],
    correct: 1,
    explanation: 'TCP is a connection-oriented protocol with reliability, ordering, flow/congestion control, but it is slower than UDP.'
  },
  {
    question: 'Which protocol is better suited for applications like online gaming or video streaming?',
    options: [
      'TCP',
      'UDP',
      'Both are equally suitable',
      'Depends on network bandwidth'
    ],
    correct: 1,
    explanation: 'UDP is preferred for real-time applications because it is faster and tolerates packet loss without retransmission delays.'
  },
  {
    question: 'What is the purpose of TCP’s 3-way handshake?',
    options: [
      'To check available bandwidth',
      'To establish a reliable connection between client and server',
      'To authenticate the user',
      'To encrypt data before sending'
    ],
    correct: 1,
    explanation: 'The 3-way handshake (SYN, SYN-ACK, ACK) establishes a reliable TCP connection before data transfer begins.'
  },
  {
    question: 'Which of the following is NOT a feature of UDP?',
    options: [
      'No connection setup required',
      'Faster than TCP',
      'Guaranteed delivery of packets',
      'No flow control'
    ],
    correct: 2,
    explanation: 'UDP does not guarantee delivery, ordering, or reliability — unlike TCP.'
  },
  {
    question: 'What is a socket?',
    options: [
      'A hardware device used for connecting cables',
      'Combination of IP address and port number',
      'A type of firewall for network connections',
      'An encryption technique for secure data transfer'
    ],
    correct: 1,
    explanation: 'A socket uniquely identifies a network connection by pairing an IP address with a port number.'
  },
  {
    question: 'Which range of ports are considered "well-known ports"?',
    options: [
      '0–1023',
      '1024–49151',
      '49152–65535',
      '0–65535'
    ],
    correct: 0,
    explanation: 'Well-known ports range from 0–1023 (e.g., HTTP 80, HTTPS 443, FTP 21, SSH 22).'
  },
  {
    question: 'Ephemeral ports are typically used for:',
    options: [
      'Running web servers',
      'Temporary connections by client applications',
      'Well-known services like DNS and FTP',
      'Blocking unused ports'
    ],
    correct: 1,
    explanation: 'Ephemeral ports (49152–65535) are used by client-side applications for short-lived, temporary connections.'
  },
  {
    question: 'If a client communicates with a server at IP 192.168.1.10 on port 80, which of the following represents a valid socket?',
    options: [
      '192.168.1.10:80',
      '192.168.1.10',
      'Port 80',
      '192.168.1.10:TCP'
    ],
    correct: 0,
    explanation: 'A socket is represented as IP:Port (e.g., 192.168.1.10:80).'
  },
  {
    question: 'Which statement correctly compares TCP and UDP?',
    options: [
      'TCP is faster but unreliable; UDP is slower but reliable',
      'TCP is reliable with ordering; UDP is faster but connectionless',
      'TCP and UDP both guarantee delivery',
      'TCP is only used for LAN; UDP is only used for WAN'
    ],
    correct: 1,
    explanation: 'TCP provides reliable, ordered delivery with overhead; UDP is faster, connectionless, and does not guarantee delivery.'
  },
  {
    question: 'Which layer of the OSI model do TCP and UDP belong to?',
    options: [
      'Network Layer',
      'Transport Layer',
      'Application Layer',
      'Data Link Layer'
    ],
    correct: 1,
    explanation: 'Both TCP and UDP operate at the Transport Layer of the OSI model.'
  }
]
    },
    {
      id: 'ip-addressing',
      title: 'IP Addressing and Subnetting',
      description: 'IPv4 vs IPv6, subnetting, CIDR, public/private IPs',
      completed: false,
      readUrl: 'https://freedium.cfd/https://medium.com/towards-data-engineering/ip-addresses-networks-and-subnets-the-internet-mechanisms-of-communication-e01feeae4800',
      concepts: [
        'IPv4 vs IPv6',
        'Classes of IP (A, B, C, etc.)',
        'Subnet mask, CIDR notation',
        'Public vs Private IPs'
      ],
      quiz: [
  {
    question: 'Which of the following is true about IPv4?',
    options: [
      'Uses 128-bit address space',
      'Supports around 4.3 billion unique addresses',
      'Mandatory IPsec support',
      'Represented in hexadecimal'
    ],
    correct: 1,
    explanation: 'IPv4 uses 32-bit addresses, giving ~4.3 billion possible addresses, represented in dotted decimal format.'
  },
  {
    question: 'Which feature is unique to IPv6 compared to IPv4?',
    options: [
      'Connection-oriented communication',
      '128-bit addressing and larger address space',
      'Divided into 4 octets',
      'Supports only unicast addressing'
    ],
    correct: 1,
    explanation: 'IPv6 uses 128-bit addresses, vastly increasing available addresses and supporting unicast, multicast, and anycast.'
  },
  {
    question: 'IPv4 address 192.168.1.1 belongs to which class?',
    options: [
      'Class A',
      'Class B',
      'Class C',
      'Class D'
    ],
    correct: 2,
    explanation: 'Class C addresses range from 192.0.0.0 to 223.255.255.255. 192.168.1.1 is a Class C private IP.'
  },
  {
    question: 'Which IP class is used for multicast?',
    options: [
      'Class A',
      'Class B',
      'Class C',
      'Class D'
    ],
    correct: 3,
    explanation: 'Class D (224.0.0.0 – 239.255.255.255) is reserved for multicast.'
  },
  {
    question: 'What does the subnet mask 255.255.255.0 indicate?',
    options: [
      'A /24 network with 256 total addresses',
      'A /16 network with 65,536 addresses',
      'A /8 network with 16 million addresses',
      'A /32 network with 1 usable address'
    ],
    correct: 0,
    explanation: '255.255.255.0 is /24 subnet mask, providing 256 total addresses (254 usable).'
  },
  {
    question: 'Which of the following is a correct CIDR notation?',
    options: [
      '192.168.0.0/24',
      '255.255.255.0/192',
      '10.0.0.0/255',
      '172.16.0.1/16.255'
    ],
    correct: 0,
    explanation: 'CIDR notation represents an IP followed by prefix length (e.g., /24 = 255.255.255.0).'
  },
  {
    question: 'Which of the following is a private IP address?',
    options: [
      '8.8.8.8',
      '192.168.0.10',
      '172.32.5.4',
      '11.1.1.1'
    ],
    correct: 1,
    explanation: 'Private IP ranges: 10.0.0.0–10.255.255.255, 172.16.0.0–172.31.255.255, 192.168.0.0–192.168.255.255.'
  },
  {
    question: 'Public IP addresses are:',
    options: [
      'Used only inside private LANs',
      'Globally unique and routable on the internet',
      'Limited to Class A addresses only',
      'Always static'
    ],
    correct: 1,
    explanation: 'Public IPs are globally routable and unique, unlike private IPs which are used only in local networks.'
  },
  {
    question: 'Which of the following is NOT true about IPv6?',
    options: [
      'It eliminates the need for NAT',
      'It uses hexadecimal representation',
      'It has a 32-bit address space',
      'It provides built-in support for IPsec'
    ],
    correct: 2,
    explanation: 'IPv6 uses a 128-bit address space, not 32-bit like IPv4.'
  },
  {
    question: 'The address 10.0.0.5/8 belongs to which category?',
    options: [
      'Public Class A',
      'Private Class A',
      'Private Class C',
      'Loopback'
    ],
    correct: 1,
    explanation: '10.0.0.0/8 is reserved for private IPs (Class A private range).'
  }
]
    },
    {
      id: 'dns-dhcp',
      title: 'DNS and DHCP',
      description: 'DNS for name resolution, DHCP for dynamic IP assignment, DNS caching',
      completed: false,
      readUrl: 'https://medium.com/@1303727890/difference-between-dhcp-vs-dns-af89ac1dafb5',
      concepts: [
        'DNS: Resolves domain names to IPs',
        'DHCP: Dynamically assigns IP addresses',
        'How caching works in DNS'
      ],
      quiz: [
  {
    question: 'What is the main purpose of DNS?',
    options: [
      'To assign IP addresses dynamically',
      'To resolve human-readable domain names into IP addresses',
      'To encrypt internet communication',
      'To provide email services'
    ],
    correct: 1,
    explanation: 'DNS (Domain Name System) translates domain names (like google.com) into IP addresses for communication.'
  },
  {
    question: 'Which protocol is typically used by DNS for queries?',
    options: [
      'TCP only',
      'UDP on port 53 (sometimes TCP)',
      'HTTP on port 80',
      'ICMP'
    ],
    correct: 1,
    explanation: 'DNS primarily uses UDP port 53 for queries. For larger responses (like zone transfers), it can use TCP.'
  },
  {
    question: 'What is the role of DHCP in a network?',
    options: [
      'Resolving domains to IP addresses',
      'Assigning IP addresses and network configurations dynamically',
      'Providing static IPs to servers',
      'Securing DNS traffic'
    ],
    correct: 1,
    explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, gateways, and DNS servers.'
  },
  {
    question: 'Which of the following is NOT provided by DHCP?',
    options: [
      'Default gateway',
      'Subnet mask',
      'MAC address',
      'DNS server'
    ],
    correct: 2,
    explanation: 'MAC addresses are hardware-defined and cannot be assigned by DHCP.'
  },
  {
    question: 'How does DNS caching improve performance?',
    options: [
      'By reducing the number of hops between routers',
      'By storing previously resolved queries to avoid repeated lookups',
      'By assigning IP addresses faster',
      'By compressing DNS packets'
    ],
    correct: 1,
    explanation: 'DNS caching stores recently resolved domain-to-IP mappings, reducing repeated lookups and speeding up browsing.'
  },
  {
    question: 'Where can DNS caching occur?',
    options: [
      'Only on DNS root servers',
      'On client devices, ISPs, and intermediate DNS resolvers',
      'Only on local routers',
      'Nowhere, DNS never caches'
    ],
    correct: 1,
    explanation: 'DNS caching happens at multiple levels: client OS, browser, local DNS resolver, and ISP DNS servers.'
  },
  {
    question: 'What is TTL in DNS caching?',
    options: [
      'Time to Live – how long a DNS record stays cached',
      'Total Transfer Latency – DNS query time',
      'Transmission Timing Layer – DNS transport layer',
      'Temporary Transfer Link – backup DNS path'
    ],
    correct: 0,
    explanation: 'TTL (Time to Live) determines how long a DNS record can be cached before expiring and requiring a fresh lookup.'
  },
  {
    question: 'What happens if a DHCP server is unavailable?',
    options: [
      'Clients will self-assign an APIPA (Automatic Private IP Address)',
      'Clients will continue working normally with no IP',
      'The DNS will take over and assign IPs',
      'The system will immediately shut down'
    ],
    correct: 0,
    explanation: 'If DHCP is unavailable, clients use APIPA (169.254.x.x) addresses, which allow limited local communication but no internet.'
  },
  {
    question: 'Which protocol does DHCP use at the transport layer?',
    options: [
      'TCP',
      'UDP',
      'ICMP',
      'HTTP'
    ],
    correct: 1,
    explanation: 'DHCP uses UDP (ports 67 for server, 68 for client) to send configuration messages.'
  },
  {
    question: 'Which of these describes the relationship between DNS and DHCP?',
    options: [
      'DNS assigns IPs, DHCP resolves domains',
      'DHCP assigns IPs, DNS resolves domains',
      'Both assign IPs',
      'Both resolve domains'
    ],
    correct: 1,
    explanation: 'DHCP dynamically assigns IP addresses; DNS translates domain names into IP addresses.'
  }
]
    },
    {
      id: 'http-https',
      title: 'HTTP/HTTPS and Application Layer Protocols',
      description: 'HTTP methods, statelessness, cookies, sessions, HTTPS',
      completed: false,
      readUrl: 'https://medium.com/@iAadiDev/exploring-http-and-https-protocols-in-network-security-b1a94bef2891',
      concepts: [
        'HTTP methods: GET, POST, PUT, DELETE',
        'Stateless nature of HTTP',
        'Cookies, Sessions, JWT',
        'HTTPS (TLS/SSL encryption)'
      ],
    quiz: [
  {
    question: 'Which HTTP method is typically used to retrieve data from a server without modifying it?',
    options: ['POST', 'GET', 'PUT', 'DELETE'],
    correct: 1,
    explanation: 'GET is used to request data from a server without causing any side effects.'
  },
  {
    question: 'Which HTTP method is idempotent and updates an existing resource?',
    options: ['POST', 'GET', 'PUT', 'DELETE'],
    correct: 2,
    explanation: 'PUT is idempotent: multiple identical PUT requests result in the same resource state.'
  },
  {
    question: 'Which HTTP method is used to delete a resource on the server?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correct: 3,
    explanation: 'DELETE is used to remove resources from the server.'
  },
  {
    question: 'What does it mean that HTTP is "stateless"?',
    options: [
      'Each request is independent and the server does not store session info',
      'HTTP servers remember all previous requests',
      'HTTP can only handle one client at a time',
      'HTTP does not allow cookies'
    ],
    correct: 0,
    explanation: 'HTTP is stateless, meaning each request is independent and servers don’t retain client information unless additional mechanisms are used.'
  },
  {
    question: 'What is the main purpose of cookies in HTTP?',
    options: [
      'To encrypt communication',
      'To store client-side data that maintains state between requests',
      'To replace GET and POST methods',
      'To manage DNS queries'
    ],
    correct: 1,
    explanation: 'Cookies are small pieces of data stored on the client, used to maintain state across stateless HTTP requests.'
  },
  {
    question: 'How are sessions different from cookies?',
    options: [
      'Sessions are stored on the client, cookies on the server',
      'Sessions are stored on the server, cookies on the client',
      'Both are stored only in the browser',
      'Neither are related to HTTP'
    ],
    correct: 1,
    explanation: 'Sessions store data on the server, while cookies store data on the client (with session ID).'
  },
  {
    question: 'What is JWT (JSON Web Token) mainly used for?',
    options: [
      'Storing passwords securely',
      'Stateless authentication between client and server',
      'Encrypting all network traffic',
      'Managing file transfers'
    ],
    correct: 1,
    explanation: 'JWT is used for stateless authentication where the server validates user identity via a signed token without storing session state.'
  },
  {
    question: 'Which of the following best describes HTTPS?',
    options: [
      'HTTP running over TLS/SSL for secure communication',
      'A faster version of HTTP',
      'A file transfer protocol',
      'An alternative to DNS'
    ],
    correct: 0,
    explanation: 'HTTPS is HTTP secured with TLS/SSL encryption, ensuring confidentiality and integrity of data.'
  },
  {
    question: 'What security features does HTTPS provide?',
    options: [
      'Confidentiality (encryption)',
      'Integrity (data not tampered)',
      'Authentication (server identity)',
      'All of the above'
    ],
    correct: 3,
    explanation: 'HTTPS provides encryption, integrity, and authentication using TLS/SSL certificates.'
  },
  {
    question: 'Which port is used by HTTPS by default?',
    options: ['80', '21', '53', '443'],
    correct: 3,
    explanation: 'HTTPS uses port 443 by default, while HTTP uses port 80.'
  }
]
    },
    {
      id: 'tcp-handshake',
      title: 'Three-way Handshake & TCP Connection Management',
      description: 'TCP connection establishment and termination, retransmissions',
      completed: false,
      readUrl: 'https://cabulous.medium.com/tcp-3-way-handshake-and-how-it-works-8c5f8d6ea11b',
      concepts: [
        'Connection Establishment: SYN, SYN-ACK, ACK',
        'Connection Termination: FIN, FIN-ACK',
        'Timeout & retransmissions'
      ],
     quiz: [
  {
    question: 'How many steps are involved in the TCP 3-way handshake for connection establishment?',
    options: ['2', '3', '4', '5'],
    correct: 1,
    explanation: 'TCP uses a 3-way handshake: SYN, SYN-ACK, and ACK.'
  },
  {
    question: 'In the first step of the TCP handshake, the client sends:',
    options: ['SYN', 'ACK', 'SYN-ACK', 'FIN'],
    correct: 0,
    explanation: 'The client initiates connection establishment by sending a SYN packet.'
  },
  {
    question: 'What does the server reply with after receiving a SYN from the client?',
    options: ['ACK', 'FIN', 'SYN-ACK', 'SYN'],
    correct: 2,
    explanation: 'The server responds with SYN-ACK, acknowledging the client’s SYN and sending its own SYN.'
  },
  {
    question: 'What is the final step of the 3-way handshake?',
    options: ['Client sends SYN', 'Server sends ACK', 'Client sends ACK', 'Server sends FIN'],
    correct: 2,
    explanation: 'The client sends an ACK to confirm, completing the 3-way handshake.'
  },
  {
    question: 'Which flag is used to initiate connection termination in TCP?',
    options: ['SYN', 'ACK', 'FIN', 'RST'],
    correct: 2,
    explanation: 'The FIN (Finish) flag is used to begin closing a TCP connection.'
  },
  {
    question: 'How many steps are typically involved in TCP connection termination?',
    options: ['2', '3', '4', '5'],
    correct: 2,
    explanation: 'TCP termination usually involves 4 steps (FIN, ACK, FIN, ACK).'
  },
  {
    question: 'What does the server send in response to a FIN from the client?',
    options: ['SYN', 'ACK', 'FIN-ACK', 'RST'],
    correct: 1,
    explanation: 'The server acknowledges the FIN with an ACK, then later sends its own FIN.'
  },
  {
    question: 'Which mechanism allows TCP to resend lost packets after waiting a specified time?',
    options: ['Flow control', 'Timeout & retransmission', 'Congestion control', 'Windowing'],
    correct: 1,
    explanation: 'TCP uses timeout and retransmission to ensure reliable delivery when packets are lost.'
  },
  {
    question: 'What happens if an ACK is not received within the retransmission timeout (RTO)?',
    options: [
      'The connection closes immediately',
      'The packet is retransmitted',
      'The sender ignores it',
      'A SYN is resent'
    ],
    correct: 1,
    explanation: 'If no ACK arrives within RTO, TCP retransmits the unacknowledged segment.'
  },
  {
    question: 'Which of the following ensures TCP reliability?',
    options: [
      '3-way handshake',
      'Acknowledgments and retransmissions',
      'Sequence numbers',
      'All of the above'
    ],
    correct: 3,
    explanation: 'TCP reliability is achieved through handshake, sequence numbers, ACKs, and retransmissions.'
  }
]

    },
    {
      id: 'congestion-flow-control',
      title: 'Congestion Control & Flow Control',
      description: 'TCP flow and congestion control mechanisms',
      completed: false,
      readUrl: 'https://medium.com/@pranavofficial404/understanding-tcp-reliability-connection-lifecycle-flow-control-and-congestion-control-88395b4423b0',
      concepts: [
        'Flow Control: Receiver-based (window size)',
        'Congestion Control: Network-based (e.g., TCP Tahoe, Reno)',
        'Slow Start, Congestion Avoidance, Fast Retransmit'
      ],
      quiz: [
  {
    question: 'What is the main purpose of flow control in TCP?',
    options: [
      'To avoid congestion in the network',
      'To prevent sender from overwhelming the receiver',
      'To reduce packet loss due to collisions',
      'To speed up data transmission'
    ],
    correct: 1,
    explanation: 'Flow control ensures the sender does not send more data than the receiver can handle, based on window size.'
  },
  {
    question: 'Flow control in TCP is implemented using:',
    options: ['Congestion window', 'Sliding window (receiver window size)', 'Round-trip time', 'Packet priority'],
    correct: 1,
    explanation: 'TCP uses the receiver-advertised window size to manage flow control.'
  },
  {
    question: 'What is the purpose of congestion control?',
    options: [
      'To avoid overwhelming the receiver',
      'To avoid overwhelming the network',
      'To reorder packets at the receiver',
      'To maintain packet encryption'
    ],
    correct: 1,
    explanation: 'Congestion control prevents excessive load on the network, reducing packet loss and delay.'
  },
  {
    question: 'Which TCP algorithms handle congestion control?',
    options: ['Go-Back-N, Selective Repeat', 'Tahoe, Reno', 'AIMD, ARQ', 'RSA, AES'],
    correct: 1,
    explanation: 'TCP Tahoe and TCP Reno are well-known congestion control algorithms.'
  },
  {
    question: 'In TCP slow start, the congestion window (cwnd) grows:',
    options: ['Linearly', 'Exponentially', 'Randomly', 'Remains fixed'],
    correct: 1,
    explanation: 'In slow start, cwnd doubles each round-trip time (exponential growth).'
  },
  {
    question: 'During congestion avoidance, the congestion window increases:',
    options: ['Exponentially', 'Linearly', 'Decreases to half', 'Drops to 1'],
    correct: 1,
    explanation: 'In congestion avoidance, cwnd increases linearly to prevent congestion.'
  },
  {
    question: 'What does TCP do when packet loss is detected via timeout?',
    options: [
      'Increases cwnd to maximum',
      'Resets cwnd to 1 (slow start)',
      'Halves cwnd',
      'Ignores the loss'
    ],
    correct: 1,
    explanation: 'When loss occurs (timeout), TCP resets cwnd to 1 and enters slow start again.'
  },
  {
    question: 'Fast retransmit is triggered when:',
    options: [
      'A timeout occurs',
      'Duplicate ACKs (usually 3) are received',
      'Receiver sends a FIN',
      'Congestion window is full'
    ],
    correct: 1,
    explanation: 'Fast retransmit is triggered after 3 duplicate ACKs, allowing early packet retransmission without waiting for timeout.'
  },
  {
    question: 'How does TCP Reno handle fast recovery after fast retransmit?',
    options: [
      'Drops cwnd to 1',
      'Halves cwnd and enters congestion avoidance',
      'Closes the connection',
      'Increases cwnd exponentially'
    ],
    correct: 1,
    explanation: 'TCP Reno halves cwnd and enters congestion avoidance instead of restarting slow start.'
  },
  {
    question: 'Which of the following correctly describes AIMD (Additive Increase Multiplicative Decrease)?',
    options: [
      'cwnd increases exponentially, decreases exponentially',
      'cwnd increases linearly, decreases drastically',
      'cwnd remains constant',
      'cwnd increases randomly'
    ],
    correct: 1,
    explanation: 'AIMD means TCP increases cwnd linearly until loss, then halves it (multiplicative decrease).'
  }
]
    },
    {
      id: 'routing-switching',
      title: 'Routing and Switching',
      description: 'Routers vs switches, routing protocols, NAT, ARP',
      completed: false,
      readUrl: 'https://devsafehouse.medium.com/switches-and-routers-whats-the-difference-df2dedc24d86',
      concepts: [
        'Difference between routers and switches',
        'Routing protocols: RIP, OSPF, BGP',
        'NAT (Network Address Translation)',
        'ARP (Address Resolution Protocol)'
      ],
      quiz: [
  {
    question: 'What is the main difference between a switch and a router?',
    options: [
      'Switch connects multiple networks, Router connects devices in a LAN',
      'Switch connects devices in a LAN, Router connects different networks',
      'Both do the same job',
      'Router works only at Physical Layer'
    ],
    correct: 1,
    explanation: 'Switch operates mainly at Layer 2 (Data Link) to connect devices in a LAN, while Router works at Layer 3 (Network) to connect different networks.'
  },
  {
    question: 'At which OSI layer does a router primarily operate?',
    options: ['Layer 1 - Physical', 'Layer 2 - Data Link', 'Layer 3 - Network', 'Layer 4 - Transport'],
    correct: 2,
    explanation: 'Routers work at Layer 3 (Network layer), making forwarding decisions using IP addresses.'
  },
  {
    question: 'Which routing protocol is distance-vector and uses hop count as a metric?',
    options: ['RIP', 'OSPF', 'BGP', 'EIGRP'],
    correct: 0,
    explanation: 'RIP (Routing Information Protocol) is distance-vector based and uses hop count as the routing metric.'
  },
  {
    question: 'Which routing protocol is link-state and uses Dijkstra’s algorithm?',
    options: ['RIP', 'OSPF', 'BGP', 'EIGRP'],
    correct: 1,
    explanation: 'OSPF (Open Shortest Path First) is a link-state protocol using Dijkstra’s shortest path algorithm.'
  },
  {
    question: 'Which routing protocol is path-vector and commonly used for inter-domain routing on the Internet?',
    options: ['RIP', 'OSPF', 'BGP', 'EIGRP'],
    correct: 2,
    explanation: 'BGP (Border Gateway Protocol) is a path-vector protocol and the backbone of Internet routing.'
  },
  {
    question: 'What is the main purpose of NAT (Network Address Translation)?',
    options: [
      'Translate MAC addresses to IP addresses',
      'Map private IPs to public IPs for Internet access',
      'Encrypt IP packets for security',
      'Speed up routing decisions'
    ],
    correct: 1,
    explanation: 'NAT translates private IP addresses into a public IP, allowing multiple devices to share a single public IP.'
  },
  {
    question: 'Which of the following is NOT a type of NAT?',
    options: ['Static NAT', 'Dynamic NAT', 'Port Address Translation (PAT)', 'Link-state NAT'],
    correct: 3,
    explanation: 'Static, Dynamic, and PAT are valid NAT types. "Link-state NAT" does not exist.'
  },
  {
    question: 'What is the function of ARP (Address Resolution Protocol)?',
    options: [
      'Resolves IP addresses to MAC addresses',
      'Resolves MAC addresses to IP addresses',
      'Resolves domain names to IP addresses',
      'Translates private IP to public IP'
    ],
    correct: 0,
    explanation: 'ARP maps an IP address (Layer 3) to its corresponding MAC address (Layer 2).'
  },
  {
    question: 'At which OSI layer does ARP operate?',
    options: ['Layer 1 - Physical', 'Layer 2 - Data Link', 'Layer 3 - Network', 'Layer 7 - Application'],
    correct: 1,
    explanation: 'Although ARP relates IP (Layer 3) to MAC, it operates within the Data Link layer to deliver frames.'
  },
  {
    question: 'Which statement about switches and routers is TRUE?',
    options: [
      'Switches reduce collision domains, Routers reduce broadcast domains',
      'Routers reduce collision domains, Switches reduce broadcast domains',
      'Both reduce broadcast domains',
      'Both reduce collision domains'
    ],
    correct: 0,
    explanation: 'Switches reduce collision domains by segmenting LANs. Routers reduce broadcast domains by separating networks.'
  }
]
    },
    {
      id: 'mac-datalink',
      title: 'MAC Address & Data Link Layer',
      description: 'MAC address, CSMA/CD, CSMA/CA, ARP, Ethernet framing',
      completed: false,
      readUrl: 'https://medium.com/@nay1228/day-3-exploring-the-osi-model-part-1-the-physical-and-data-link-layers-65b40032cbe6',
      concepts: [
        'MAC address format and uniqueness',
        'CSMA/CD (Ethernet) vs CSMA/CA (Wi-Fi)',
        'ARP (MAC ↔ IP resolution)',
        'Ethernet framing'
      ],
     quiz: [
  {
    question: 'What is the length of a MAC address?',
    options: ['32 bits', '48 bits', '64 bits', '128 bits'],
    correct: 1,
    explanation: 'MAC addresses are 48 bits long (6 bytes), usually represented in hexadecimal.'
  },
  {
    question: 'How is uniqueness of MAC addresses ensured?',
    options: [
      'Assigned by the user manually',
      'Generated randomly by each device',
      'First 24 bits represent vendor (OUI) assigned by IEEE',
      'By using the device’s IP address'
    ],
    correct: 2,
    explanation: 'MAC addresses are unique because the first 24 bits are the Organizationally Unique Identifier (OUI) assigned by IEEE to vendors.'
  },
  {
    question: 'Which protocol is used to resolve an IP address to a MAC address?',
    options: ['DNS', 'ARP', 'DHCP', 'ICMP'],
    correct: 1,
    explanation: 'ARP (Address Resolution Protocol) maps IP addresses (Layer 3) to MAC addresses (Layer 2).'
  },
  {
    question: 'Which access method does traditional Ethernet (wired) use?',
    options: ['CSMA/CD', 'CSMA/CA', 'TDMA', 'FDMA'],
    correct: 0,
    explanation: 'Ethernet uses CSMA/CD (Carrier Sense Multiple Access with Collision Detection) to manage shared channel access.'
  },
  {
    question: 'Which access method does Wi-Fi (IEEE 802.11) use?',
    options: ['CSMA/CD', 'CSMA/CA', 'TDMA', 'ALOHA'],
    correct: 1,
    explanation: 'Wi-Fi uses CSMA/CA (Collision Avoidance) since wireless devices cannot detect collisions effectively.'
  },
  {
    question: 'Why does Wi-Fi use CSMA/CA instead of CSMA/CD?',
    options: [
      'Because Wi-Fi is faster',
      'Because collisions cannot be detected easily in wireless medium',
      'Because Wi-Fi does not use MAC addresses',
      'Because Wi-Fi only works at the Network layer'
    ],
    correct: 1,
    explanation: 'In wireless networks, it is difficult to detect collisions due to hidden/exposed terminals, so Wi-Fi uses CSMA/CA with acknowledgments.'
  },
  {
    question: 'Which of the following is NOT part of an Ethernet frame?',
    options: ['Preamble', 'Source MAC', 'Destination MAC', 'TTL (Time to Live)'],
    correct: 3,
    explanation: 'TTL is part of the IP header (Layer 3), not the Ethernet frame (Layer 2).'
  },
  {
    question: 'What is the minimum and maximum size of an Ethernet frame (without preamble)?',
    options: [
      '64 bytes minimum, 1518 bytes maximum',
      '46 bytes minimum, 1024 bytes maximum',
      '32 bytes minimum, 2048 bytes maximum',
      '128 bytes minimum, 4096 bytes maximum'
    ],
    correct: 0,
    explanation: 'Ethernet frames must be at least 64 bytes and at most 1518 bytes (without VLAN tag).'
  },
  {
    question: 'Which field in the Ethernet frame helps identify the protocol used in the payload?',
    options: ['Preamble', 'Type/Length field', 'CRC', 'MAC address'],
    correct: 1,
    explanation: 'The Type/Length field indicates which Layer 3 protocol (e.g., IPv4, IPv6, ARP) is encapsulated.'
  },
  {
    question: 'What is the purpose of the CRC field in Ethernet frames?',
    options: [
      'To identify the source MAC',
      'To detect transmission errors',
      'To assign priority',
      'To resolve collisions'
    ],
    correct: 1,
    explanation: 'CRC (Cyclic Redundancy Check) is used for error detection in Ethernet frames.'
  }
]
    },
    {
      id: 'network-security',
      title: 'Network Security Basics',
      description: 'SSL/TLS, firewalls, VPN, encryption, attacks, HTTPS handshake',
      completed: false,
      readUrl: 'https://medium.com/@lazygeek78/security-insight-fundamentals-59b8ee11b844',
      concepts: [
        'SSL/TLS, Firewall, VPN',
        'Symmetric vs Asymmetric encryption',
        'Man-in-the-middle attack, DDoS, sniffing',
        'HTTPS handshake'
      ],
      quiz: [
  {
    question: 'What is the primary purpose of SSL/TLS?',
    options: [
      'To compress data',
      'To encrypt communication between client and server',
      'To speed up internet connections',
      'To assign IP addresses'
    ],
    correct: 1,
    explanation: 'SSL/TLS provides encryption, authentication, and integrity for secure communication between client and server.'
  },
  {
    question: 'Which of the following is NOT a function of a firewall?',
    options: [
      'Filtering traffic based on rules',
      'Preventing unauthorized access',
      'Encrypting end-to-end data',
      'Blocking malicious traffic'
    ],
    correct: 2,
    explanation: 'Firewalls control traffic flow, but encryption is handled by SSL/TLS or VPN, not firewalls.'
  },
  {
    question: 'What is the main purpose of a VPN?',
    options: [
      'To hide browsing history',
      'To create a secure encrypted tunnel over the internet',
      'To block malware',
      'To speed up downloads'
    ],
    correct: 1,
    explanation: 'A VPN (Virtual Private Network) creates a secure encrypted tunnel between client and server, ensuring privacy and security.'
  },
  {
    question: 'Which encryption uses a single key for both encryption and decryption?',
    options: ['Symmetric', 'Asymmetric', 'Hybrid', 'Quantum'],
    correct: 0,
    explanation: 'Symmetric encryption uses the same key for encryption and decryption (e.g., AES).'
  },
  {
    question: 'Which encryption uses a pair of public and private keys?',
    options: ['Symmetric', 'Asymmetric', 'Hashing', 'One-time pad'],
    correct: 1,
    explanation: 'Asymmetric encryption uses a public/private key pair (e.g., RSA).'
  },
  {
    question: 'Which attack involves intercepting communication between two parties without their knowledge?',
    options: ['DDoS', 'Phishing', 'Man-in-the-middle', 'Brute force'],
    correct: 2,
    explanation: 'In a Man-in-the-Middle attack, the attacker secretly relays or alters communication between two parties.'
  },
  {
    question: 'Which attack floods a server with requests, making it unavailable?',
    options: ['MITM', 'Sniffing', 'DDoS', 'SQL Injection'],
    correct: 2,
    explanation: 'DDoS (Distributed Denial of Service) overloads a server with traffic from multiple machines, causing service disruption.'
  },
  {
    question: 'Which attack involves capturing and analyzing unencrypted network traffic?',
    options: ['Spoofing', 'Sniffing', 'MITM', 'Phishing'],
    correct: 1,
    explanation: 'Sniffing is intercepting and analyzing packets, often using tools like Wireshark.'
  },
  {
    question: 'During an HTTPS handshake, which key exchange mechanism is commonly used?',
    options: ['AES', 'RSA or Diffie-Hellman', 'MD5', 'SHA-1'],
    correct: 1,
    explanation: 'RSA or Diffie-Hellman key exchange is used to securely share session keys during an HTTPS handshake.'
  },
  {
    question: 'What happens after the HTTPS handshake is complete?',
    options: [
      'All further communication uses symmetric encryption',
      'The connection switches to plain text',
      'The firewall starts encrypting packets',
      'The server changes its IP'
    ],
    correct: 0,
    explanation: 'After the handshake, both parties use symmetric encryption (faster) for the actual data transfer.'
  }
]
    }
  ];
  