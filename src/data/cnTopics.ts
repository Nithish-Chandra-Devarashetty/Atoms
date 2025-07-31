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
          question: 'How many layers are there in the OSI model?',
          options: ['4', '5', '6', '7'],
          correct: 3,
          explanation: 'The OSI model has 7 layers.'
        },
        {
          question: 'At which OSI layer does the IP protocol operate?',
          options: ['Transport', 'Network', 'Data Link', 'Session'],
          correct: 1,
          explanation: 'IP operates at the Network layer of the OSI model.'
        },
        {
          question: 'What is encapsulation in networking?',
          options: [
            'Wrapping data with protocol information as it moves down the layers',
            'Encrypting data',
            'Compressing data',
            'Removing headers from data'
          ],
          correct: 0,
          explanation: 'Encapsulation is the process of wrapping data with protocol information as it moves down the layers.'
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
          question: 'Which protocol is connection-oriented?',
          options: ['TCP', 'UDP', 'Both', 'Neither'],
          correct: 0,
          explanation: 'TCP is connection-oriented, UDP is connectionless.'
        },
        {
          question: 'Why is UDP preferred for video streaming?',
          options: [
            'It is more reliable',
            'It is faster and can tolerate some data loss',
            'It uses less bandwidth',
            'It is encrypted by default'
          ],
          correct: 1,
          explanation: 'UDP is faster and can tolerate some data loss, making it suitable for streaming.'
        },
        {
          question: 'What is a port in networking?',
          options: [
            'A physical connector',
            'A logical endpoint for communication',
            'A type of protocol',
            'A network device'
          ],
          correct: 1,
          explanation: 'A port is a logical endpoint for communication.'
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
          question: 'What is the main difference between IPv4 and IPv6?',
          options: [
            'IPv4 is faster',
            'IPv6 uses 128 bits, IPv4 uses 32 bits',
            'IPv4 is only for LAN',
            'IPv6 is not routable'
          ],
          correct: 1,
          explanation: 'IPv6 addresses are 128 bits, IPv4 addresses are 32 bits.'
        },
        {
          question: 'What does a /24 mean in CIDR notation?',
          options: [
            '24 hosts',
            '24 subnets',
            'Subnet mask 255.255.255.0',
            'Subnet mask 255.255.0.0'
          ],
          correct: 2,
          explanation: '/24 means a subnet mask of 255.255.255.0.'
        },
        {
          question: 'What type of IP address is 192.168.x.x?',
          options: [
            'Public',
            'Private',
            'Loopback',
            'Broadcast'
          ],
          correct: 1,
          explanation: '192.168.x.x is a private IP address.'
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
          question: 'What does DNS do?',
          options: [
            'Assigns IP addresses',
            'Resolves domain names to IP addresses',
            'Encrypts data',
            'Routes packets'
          ],
          correct: 1,
          explanation: 'DNS resolves domain names to IP addresses.'
        },
        {
          question: 'What is DHCP used for?',
          options: [
            'Assigning IP addresses dynamically',
            'Resolving domain names',
            'Encrypting traffic',
            'Routing packets'
          ],
          correct: 0,
          explanation: 'DHCP dynamically assigns IP addresses to devices.'
        },
        {
          question: 'What is DNS cache poisoning?',
          options: [
            'A type of DDoS attack',
            'Corrupting the DNS cache to redirect traffic',
            'Encrypting DNS queries',
            'Blocking DNS requests'
          ],
          correct: 1,
          explanation: 'DNS cache poisoning corrupts the DNS cache to redirect traffic.'
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
          question: 'Which HTTP method is used to retrieve data?',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          correct: 0,
          explanation: 'GET is used to retrieve data.'
        },
        {
          question: 'What is the main difference between HTTP and HTTPS?',
          options: [
            'HTTPS uses encryption (TLS/SSL)',
            'HTTP is faster',
            'HTTPS uses a different port',
            'HTTP is more secure'
          ],
          correct: 0,
          explanation: 'HTTPS uses encryption (TLS/SSL) to secure data.'
        },
        {
          question: 'What is a cookie used for?',
          options: [
            'Storing user data on the client',
            'Encrypting traffic',
            'Routing packets',
            'Assigning IP addresses'
          ],
          correct: 0,
          explanation: 'Cookies store user data on the client for session management.'
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
          question: 'How many steps are in the TCP three-way handshake?',
          options: ['2', '3', '4', '5'],
          correct: 1,
          explanation: 'The TCP three-way handshake has 3 steps: SYN, SYN-ACK, ACK.'
        },
        {
          question: 'What happens if the SYN packet is lost during connection establishment?',
          options: [
            'Connection is immediately established',
            'The sender retransmits the SYN after a timeout',
            'The receiver sends a FIN',
            'The connection is closed'
          ],
          correct: 1,
          explanation: 'If SYN is lost, the sender retransmits it after a timeout.'
        },
        {
          question: 'Which flag is used to terminate a TCP connection?',
          options: ['SYN', 'ACK', 'FIN', 'RST'],
          correct: 2,
          explanation: 'FIN is used to terminate a TCP connection.'
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
          question: 'What is the purpose of flow control in TCP?',
          options: [
            'To prevent congestion in the network',
            'To ensure the sender does not overwhelm the receiver',
            'To encrypt data',
            'To assign IP addresses'
          ],
          correct: 1,
          explanation: 'Flow control ensures the sender does not overwhelm the receiver.'
        },
        {
          question: 'Which algorithm is used for congestion control in TCP?',
          options: ['Slow Start', 'Stop-and-Wait', 'Go-Back-N', 'Selective Repeat'],
          correct: 0,
          explanation: 'Slow Start is used for congestion control in TCP.'
        },
        {
          question: 'What is the difference between flow control and congestion control?',
          options: [
            'Flow control is sender-based, congestion control is receiver-based',
            'Flow control is receiver-based, congestion control is network-based',
            'Both are the same',
            'Congestion control is only for UDP'
          ],
          correct: 1,
          explanation: 'Flow control is receiver-based, congestion control is network-based.'
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
          question: 'What is the main function of a router?',
          options: [
            'Forward packets between networks',
            'Connect devices within a network',
            'Assign IP addresses',
            'Encrypt data'
          ],
          correct: 0,
          explanation: 'Routers forward packets between networks.'
        },
        {
          question: 'What does NAT do?',
          options: [
            'Translates private IPs to public IPs',
            'Assigns MAC addresses',
            'Encrypts data',
            'Routes packets within a LAN'
          ],
          correct: 0,
          explanation: 'NAT translates private IP addresses to public IP addresses.'
        },
        {
          question: 'Which protocol is used to resolve IP addresses to MAC addresses?',
          options: ['RIP', 'ARP', 'BGP', 'OSPF'],
          correct: 1,
          explanation: 'ARP resolves IP addresses to MAC addresses.'
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
          question: 'What is a MAC address?',
          options: [
            'A logical address',
            'A unique hardware address for network interfaces',
            'A type of protocol',
            'A routing algorithm'
          ],
          correct: 1,
          explanation: 'A MAC address is a unique hardware address for network interfaces.'
        },
        {
          question: 'Which protocol is used for MAC to IP resolution?',
          options: ['ARP', 'RIP', 'BGP', 'NAT'],
          correct: 0,
          explanation: 'ARP is used for MAC to IP resolution.'
        },
        {
          question: 'What is the difference between CSMA/CD and CSMA/CA?',
          options: [
            'CSMA/CD is for Ethernet, CSMA/CA is for Wi-Fi',
            'CSMA/CA is for Ethernet, CSMA/CD is for Wi-Fi',
            'Both are for Wi-Fi',
            'Both are for Ethernet'
          ],
          correct: 0,
          explanation: 'CSMA/CD is used in Ethernet, CSMA/CA is used in Wi-Fi.'
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
          question: 'What is the difference between SSL and TLS?',
          options: [
            'SSL is newer than TLS',
            'TLS is newer and more secure than SSL',
            'They are the same',
            'TLS is only for email'
          ],
          correct: 1,
          explanation: 'TLS is the successor to SSL and is more secure.'
        },
        {
          question: 'What is a man-in-the-middle attack?',
          options: [
            'An attack where the attacker intercepts communication between two parties',
            'A type of firewall',
            'A VPN protocol',
            'A type of encryption'
          ],
          correct: 0,
          explanation: 'A man-in-the-middle attack is when an attacker intercepts communication between two parties.'
        },
        {
          question: 'How does HTTPS ensure data security?',
          options: [
            'By using symmetric encryption only',
            'By using TLS/SSL encryption for data in transit',
            'By using firewalls',
            'By using VPNs'
          ],
          correct: 1,
          explanation: 'HTTPS uses TLS/SSL encryption to secure data in transit.'
        }
      ]
    }
  ];
  