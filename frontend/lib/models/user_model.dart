class User {
  final String id;
  final String phoneNumber;
  final String role;
  final bool isVerified;
  final DateTime createdAt;

  User({
    required this.id,
    required this.phoneNumber,
    required this.role,
    this.isVerified = false,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      phoneNumber: json['phoneNumber'],
      role: json['role'],
      isVerified: json['isVerified'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class Farmer {
  final String userId;
  final String? farmName;
  final Map<String, dynamic>? location;
  final String? farmSize;
  final List<String> crops;
  final int totalSales;
  final double rating;
  final List<String> harvests;

  Farmer({
    required this.userId,
    this.farmName,
    this.location,
    this.farmSize,
    this.crops = const [],
    this.totalSales = 0,
    this.rating = 0.0,
    this.harvests = const [],
  });

  factory Farmer.fromJson(Map<String, dynamic> json) {
    return Farmer(
      userId: json['userId'],
      farmName: json['farmName'],
      location: json['location'],
      farmSize: json['farmSize'],
      crops: List<String>.from(json['crops'] ?? []),
      totalSales: json['totalSales'] ?? 0,
      rating: (json['rating'] ?? 0).toDouble(),
      harvests: List<String>.from(json['harvests'] ?? []),
    );
  }
}

class Buyer {
  final String userId;
  final String? businessName;
  final String? businessType;
  final Map<String, dynamic>? location;
  final int totalPurchases;
  final bool verified;

  Buyer({
    required this.userId,
    this.businessName,
    this.businessType,
    this.location,
    this.totalPurchases = 0,
    this.verified = false,
  });

  factory Buyer.fromJson(Map<String, dynamic> json) {
    return Buyer(
      userId: json['userId'],
      businessName: json['businessName'],
      businessType: json['businessType'],
      location: json['location'],
      totalPurchases: json['totalPurchases'] ?? 0,
      verified: json['verified'] ?? false,
    );
  }
}

class Transporter {
  final String userId;
  final String? driverName;
  final List<String> trucks;
  final Map<String, dynamic>? currentLocation;
  final bool isAvailable;
  final int totalDeliveries;
  final double rating;

  Transporter({
    required this.userId,
    this.driverName,
    this.trucks = const [],
    this.currentLocation,
    this.isAvailable = false,
    this.totalDeliveries = 0,
    this.rating = 0.0,
  });

  factory Transporter.fromJson(Map<String, dynamic> json) {
    return Transporter(
      userId: json['userId'],
      driverName: json['driverName'],
      trucks: List<String>.from(json['trucks'] ?? []),
      currentLocation: json['currentLocation'],
      isAvailable: json['isAvailable'] ?? false,
      totalDeliveries: json['totalDeliveries'] ?? 0,
      rating: (json['rating'] ?? 0).toDouble(),
    );
  }
}
